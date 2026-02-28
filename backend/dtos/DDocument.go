package dtos

import (
	"hello/models"
	"mime/multipart"
	"time"
)

type DocumentResponse struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	FolderID    *uint     `json:"folder_id"`
	IsProcessed bool      `json:"is_processed"`
	CreatedAt   time.Time `json:"created_at"`
}

func MapDocumentToDTO(doc *models.Document) DocumentResponse {
	return DocumentResponse{
		ID:          doc.ID,
		Title:       doc.Title,
		FolderID:    doc.FolderID,
		IsProcessed: doc.IsProcessed,
		CreatedAt:   doc.CreatedAt,
	}
}

type DocumentUploadRequest struct {
	File     *multipart.FileHeader `form:"pdf" binding:"required"`
	FolderID *uint                 `form:"folder_id"`
}

type DocumentRequest struct {
	Id uint `uri:"id" binding:"required"`
}
