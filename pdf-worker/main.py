import statistics
import os

import fitz
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException

from classification import (
    classify_block_type,
    clean_content,
    find_repeating_blocks
)

from extraction import (
    classify_image_block,
    extract_image_as_base64,
    get_column,
    is_caption,
    split_block_by_font_change,
    is_equation_block,
    extract_equation
)

from tree import build_document_tree

class ProcessRequest(BaseModel):
    file_path: str


app = FastAPI()

@app.post("/process-pdf")
async def process_pdf(request: ProcessRequest):
    print(f"Processing: {request.file_path}")
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    doc = fitz.open(request.file_path)
    page_count = doc.page_count

    classified: list[dict] = []
    raw_blocks: list[dict] = []

    for page_num, page in enumerate(doc):
        page_width = page.rect.width
        dict_content = page.get_text("dict")
        blocks = dict_content["blocks"]
        blocks.sort(key=lambda b: (get_column(b,page_width), b["bbox"][1]))

        for block in blocks:

            if block["type"] == 1:
                image_type = classify_image_block(block)
                image_data = extract_image_as_base64(page, block)
                raw_blocks.append({
                    "page": page_num + 1,
                    "content": f"[{image_type.upper()}]",
                    "size": 0,
                    "is_bold": False,
                    "override": image_type,
                    "image": image_data,
                })
                continue

            if block["type"] != 0:
                continue


            if is_equation_block(block):
                latex, image_data = extract_equation(page, block)
                raw_blocks.append({
                    "page": page_num + 1,
                    "content": latex,
                    "size": 0,
                    "is_bold": False,
                    "override": "equation",
                    "image": image_data,

                })
                continue

            caption = is_caption(block, blocks)

            for sub in split_block_by_font_change(block):
                content = clean_content(sub["text"])
                if not content:
                    continue
                raw_blocks.append({
                    "page": page_num + 1,
                    "content": content,
                    "size": sub["size"],
                    "is_bold": sub["is_bold"],
                    "override": "caption" if caption else None,
                    "image": None,
                })


    doc.close()
    
    text_blocks_only = [block for block in raw_blocks if block["size"] > 0]
    repeating = find_repeating_blocks(text_blocks_only, page_count)
    raw_blocks = [block for block in raw_blocks if block["content"] not in repeating]

    if not raw_blocks:
        return {"blocks": []}


    text_size = [block["size"] for block in raw_blocks if block["size"] > 0]
    
    if not text_size:
        return{"blocks": []}
    
    body_size: float = statistics.median(text_size)
    print(f"Body size (median): {body_size}")

    

    for i, block in enumerate(raw_blocks):
        block_type = "p"
        if block["override"]:
            block_type = block["override"]
        else:
            block_type = classify_block_type(
                block["is_bold"], block["size"], body_size
            )
        
        classified.append({
            "page": block["page"],
            "content": block["content"],
            "font_size": float(block["size"]),
            "block_type": block_type,
            "sort_order": i,
            "image": block.get("image"),
        })

    tree = build_document_tree(classified)
    flat_blocks = tree.to_flat_list()

    print(f"Extracted {len(flat_blocks)} blocks across {page_count} pages")
    figures = [b for b in flat_blocks if b["block_type"] in ("figure", "table","equation")]
    print(f"Figures with image data: {sum(1 for f in figures if f['image'])}/{len(figures)}")

    return {"blocks": flat_blocks}