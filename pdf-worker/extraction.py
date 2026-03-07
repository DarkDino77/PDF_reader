import base64
import os
import io

import fitz
import httpx
from PIL import Image

PIX2TEX_URL = os.getenv("PIX2TEX_URL", "http://pix2tex:8502")

MATH_FONTS = {"cmmi", "cmsy", "cmex", "cmr", "msam", "msbm", "stmary"}

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
    img = render_block_as_pil(page, block)
    if img is None:
        return None
    return pil_to_base64(img)
    
def render_block_as_pil(page: fitz.Page, block:dict) -> Image.Image | None:
    try:
        clip = fitz.Rect(block["bbox"])
        mat = fitz.Matrix(2,2)
        pix = page.get_pixmap(matrix=mat, clip=clip)
        return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    except Exception as e:
        print(f"render_block_as_pil failed: {e}")
        return None

def pil_to_base64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/png;base64,{b64}"


def extract_equation(
        page: fitz.Page,
        block:dict
) -> tuple[str, str | None]:
    img = render_block_as_pil(page, block)
    return_string = "[EQUATION]"
    if img is None:
        return return_string, None

    if img.width == 0 or img.height == 0:
        return return_string, None
    
    image_data = pil_to_base64(img)

    try: 
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        response = httpx.post(
            f"{PIX2TEX_URL}/predict/",
            files={"file": ("equation.png", buf, "image/png")},
            timeout=30.0
        )
        response.raise_for_status()
        result = response.json()

        latex = result.strip() if isinstance(result, str) else result.get("latex", "").strip()

        if not latex:
            return return_string, image_data
        return latex, image_data
    except Exception as e:
        print(f"pix2tex service call failed: {e}")
        return return_string, image_data
    

def is_equation_block(block: dict) -> bool:

    all_spans = [span for line in block["lines"] for span in line["spans"]]
    if not all_spans:
        return False
    
    match_chars = 0
    total_chars = 0

    for span in all_spans:
        font_lower = span["font"].lower()
        char_count = len(span["text"].strip())
        total_chars += char_count
        if any(mf in font_lower for mf in MATH_FONTS):
            match_chars += char_count

    if total_chars == 0:
        return False
    
    return(match_chars/total_chars) > 0.4


def merge_equation_bboxes(blocks: list[dict]) -> dict:
    if not all("bbox" in b and b["bbox"] is not None for b in blocks):
        return None
    x0 = min(b["bbox"][0] for b in blocks)
    y0 = min(b["bbox"][1] for b in blocks)
    x1 = max(b["bbox"][2] for b in blocks)
    y1 = max(b["bbox"][3] for b in blocks)
    return [x0,y0,x1,y1]


