from fastapi import FastAPI, HTTPException
import fitz
import os
from pydantic import BaseModel

class ProcessRequest(BaseModel):
    file_path: str

def get_column(block, page_width):
    x_start = block["bbox"][0]
    if x_start > (page_width * 0.45):
        return 1
    return 0

app = FastAPI()

@app.post("/process-pdf")
async def process_pdf(request: ProcessRequest):
    print(f"Processing: {request.file_path}")
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    doc = fitz.open(request.file_path)
    extracted_content = []

    for page_num, page in enumerate(doc):
        page_width = page.rect.width
        dict_content = page.get_text("dict")
        blocks = dict_content["blocks"]
        blocks.sort(key=lambda b: (get_column(b,page_width), b["bbox"][1]))
        for block in blocks:
            if block["type"] == 0:
                block_text = ""
                for line in block["lines"]:
                    for span in line["spans"]:
                        block_text += span["text"] + " "

                extracted_content.append({
                    "page": page_num + 1,
                    "content": block_text.strip(),
                    "block_type": "paragraph",
                    "font_size": block["lines"][0]["spans"][0]["size"] if block["lines"] else 12

                })
    doc.close()
    return {"blocks": extracted_content}