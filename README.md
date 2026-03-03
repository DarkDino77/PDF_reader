# 📄 Vault — PDF Reader

A self-hosted PDF reader that extracts, stores, and presents document content with adjustable font size and line spacing. PDFs are processed by a dedicated Python microservice that handles text extraction and multi-column layout reflow, so the reading experience adapts to your preferences rather than being locked to the original document format.

---

## Features

- Upload and manage PDFs in a personal document vault
- Automatic text extraction with multi-column layout detection
- Reader view with adjustable font size and line spacing
- Background processing with live status polling
- Orphaned file janitor to keep storage consistent with the database

---

## Architecture

The application is composed of three backend services and a React frontend, all orchestrated with Docker Compose.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                    React + TypeScript                   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (REST)
┌────────────────────────▼────────────────────────────────┐
│                   Go API (Gin)  :8080                   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │ Controllers │→ │  Services   │→ │  GORM + PGSQL  │  │
│  └─────────────┘  └──────┬──────┘  └────────────────┘  │
│                          │ HTTP (internal)               │
└──────────────────────────┼──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│              Python Worker (FastAPI)  :8000             │
│                      PyMuPDF (fitz)                     │
└─────────────────────────────────────────────────────────┘
```

### Go API

Built with [Gin](https://github.com/gin-gonic/gin) and [GORM](https://gorm.io/). Follows a layered architecture:

- **Controllers** — parse and validate HTTP requests, delegate to services, return DTOs
- **Services** — business logic, file storage, database writes, python worker coordination
- **DTOs** — explicit response shapes that decouple API contracts from internal models
- **Models** — GORM models used exclusively for database operations
- **Storage interface** — `StorageProvider` abstracts the filesystem so the implementation can be swapped (e.g. to S3) without touching service logic

On startup, a background goroutine runs a **janitor** every 24 hours that retries deletion of any files that failed to be removed when their document was deleted (tracked in the `orphaned_files` table).

### Python Worker

A [FastAPI](https://fastapi.tiangolo.com/) service that accepts a file path and processes the PDF using [PyMuPDF](https://pymupdf.readthedocs.io/). It sorts text blocks by detected column position before Y-position, preserving the correct reading order for multi-column documents. Returns structured blocks with content, type, font size, and sort order.

### Frontend

Built with React, TypeScript, Tailwind CSS, and React Router. Follows **atomic design**:

```
src/
├── components/
│   ├── atoms/          # Button, Spinner, StatusBadge, StepperControl
│   ├── molecules/      # UploadButton, DocumentRow, ReaderControls
│   └── organisms/      # DocumentTable, ReaderToolbar, TextContent
├── screens/            # VaultScreen, DetailsScreen
├── hooks/              # useDocuments, useDocument, useFileUpload
├── api/                # documentApi (all fetch calls)
└── types/              # api.ts (shared interfaces)
```

API calls are centralised in `documentApi.ts`. Hooks own all async state. Components are pure — they receive data and callbacks as props.

### Database

PostgreSQL managed by GORM with `AutoMigrate`. Four tables:

| Table | Purpose |
|---|---|
| `documents` | PDF metadata and processing status |
| `text_blocks` | Extracted content blocks, ordered by `sort_order` |
| `folders` | Hierarchical document organisation |
| `orphaned_files` | Files that failed deletion, retried by the janitor |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/PDF/documents` | List all documents |
| `POST` | `/PDF/documents` | Upload a PDF |
| `GET` | `/PDF/documents/:id` | Get document with extracted blocks |
| `DELETE` | `/PDF/documents/:id` | Delete document and its file |
| `POST` | `/PDF/documents/:id/reprocess` | Re-run extraction on a document |
| `GET` | `/PDF/ping` | Health check |

---

## Running Locally

**Requirements:** Docker and Docker Compose.

1. Clone the repository
2. Create a `.env` file in the project root:
```env
POSTGRES_USER=vault
POSTGRES_PASSWORD=secret
POSTGRES_DB=vault
```
3. Start all services:
```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Go API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

The Python worker is on the internal Docker network only and is not exposed to the host.

---

## Project Structure

```
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── dtos/
│   ├── implementation/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── container.go
│   ├── main.go
│   └── Dockerfile
├── frontend/
│   ├── src/
│   └── Dockerfile
├── pdf-worker/
│   ├── python_worker.py
│   └── Dockerfile
├── uploads/           # shared volume between API and worker
├── .env
└── docker-compose.yml
```