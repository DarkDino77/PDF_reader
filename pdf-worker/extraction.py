import base64
import os

import fitz
import httpx

PIX2TEX_URL = os.getenv("PIX2TEX_URL", "http://pix2tex:8502")

def get_column(block: dict, page_width: float) -> int:
    return 1 if block["bbox"][0] > (page_width * 0.45) else 0

def get_span_props(span: dict) -> dict:
    return {
        "size": round(span["size"]),
        "is_bold": bool(span["flags"] & 16) or "bold" in span["font"].lower()
    }

def split_block_by_font_change(block: dict) -> list[dict]:
    SIZE_THRESHOLD = 1.5

    sub_blocks: list[dict] = []
    current_spans: list[dict] = []
    current_props: dict | None = None

    for line in block["lines"]:
        for span in line["spans"]:
            if not span["text"].strip():
                continue

            props = get_span_props(span)

            if current_props is None:
                current_props = props

            size_changed = abs(props["size"] - current_props["size"]) > SIZE_THRESHOLD
            bold_changed = props["is_bold"] != current_props["is_bold"]

            if (size_changed or bold_changed) and current_spans:
                sub_blocks.append({
                    "text" : " ".join(s["text"] for s in current_spans).strip(),
                    "size" : current_props["size"],
                    "is_bold": current_props["is_bold"]
                })
                current_spans = []
                current_props = props
            
            current_spans.append(span)
    if current_spans:
        sub_blocks.append({
                    "text":    " ".join(s["text"] for s in current_spans).strip(),
                    "size":    current_props["size"],
                    "is_bold": current_props["is_bold"],
                })
    return [s for s in sub_blocks if s["text"]] 

def is_caption(block: dict, all_blocks: list[dict]) -> bool:
    bx0, by0, bx1, _ = block["bbox"]
    for other in all_blocks:
        if other["type"] == 0:
            continue
        ox0, _, ox1,oy1 = other["bbox"]
        if 0 < (by0 - oy1) < 20 and bx0 < ox0 and bx1 > ox0:
            return True
    return False

def classify_image_block(block: dict) -> str:

    x0, y0, x1, y1 = block["bbox"]
    width = x1 - x0
    height = y1 - y0
    aspect = width / height if height else 0
    return "table" if aspect > 2.5 else "figure"


def extract_image_as_base64(page: fitz.Page, block:dict) -> str|None:
    try:
        clip = fitz.Rect(block["bbox"])
        mat = fitz.Matrix(2,2)
        pix = page.get_pixmap(matrix=mat, clip=clip)
        data = pix.tobytes("png")
        b64 = base64.b64encode(data).decode()
        return f"data:image/png;base64,{b64}"
    except Exception:
        return None
    
