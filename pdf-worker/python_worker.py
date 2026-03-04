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

def get_block_font_size(block) -> float:
    sizes = [
        span["size"]
        for line in block["lines"]
        for span in line["spans"]
    ]
    return round(sum(sizes)/ len(sizes)) if sizes else 12.0


def build_size_to_blocktype(sizes: list[float]) -> dic[float,str]:
    levels = ["h1","h2","h3","h4"]
    unique_sizes = sorted(set(sizes), reverse=True)
    if len(unique_sizes) == 1:
        return{unique_sizes[0]:"p"}
    
    result = {unique_sizes[-1]:"p"}
    for i, size in enumerate(unique_sizes[:-1]):
        result[size] = levels[min(i, len(levels) - 1)]

    return result


app = FastAPI()

@app.post("/process-pdf")
async def process_pdf(request: ProcessRequest):
    print(f"Processing: {request.file_path}")
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    doc = fitz.open(request.file_path)

    raw_blocks: list[dict] = []
    seen_sizes: set[float] = set()

    for page_num, page in enumerate(doc):
        page_width = page.rect.width
        dict_content = page.get_text("dict")
        blocks = dict_content["blocks"]
        blocks.sort(key=lambda b: (get_column(b,page_width), b["bbox"][1]))

        for block in blocks:
            if block["type"] != 0:
                continue

            block_text = " ".join(
                span["text"]
                for line in block["lines"]
                for span in line["spans"]
            ).strip()

            if not block_text:
                continue

            font_size = get_block_font_size(block)
            seen_sizes.add(font_size)
            raw_blocks.append({
                "page": page_num + 1,
                "content": block_text,
                "font_size": font_size
            })

    doc.close()
    
    size_to_blocktype = build_size_to_blocktype(list(seen_sizes))

    print("Size mapping:", size_to_blocktype)

    extracted_content = [
        {
            "page": block["page"],
            "content": block["content"],
            "font_size": block["font_size"],
            "block_type": size_to_blocktype[block["font_size"]]
        }
        for block in raw_blocks
    ]


    return {"blocks": extracted_content}