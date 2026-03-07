import re
from collections import Counter

def find_repeating_blocks(raw_blocks: list[dict], page_count: int) -> set[str]:
    counts: Counter = Counter(b["content"].strip() for b in raw_blocks)
    threshold = page_count * 0.4
    repeating = {text for text, count in counts.items() if count >= threshold}
    for b in raw_blocks:
        if re.fullmatch(r"\d{1,4}", b["content"].strip()):
            repeating.add(b["content"].strip())

    return repeating

def clean_content(text: str) -> str:
    """
    Fix common PyMuPDF extraction artefacts:
      - Soft-hyphenated line breaks: "imple-\\nmentation" → "implementation"
      - Collapse runs of whitespace
    """
    text = re.sub(r"-\s*\n\s*", "", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()
    # add a comment for each of the regexes to explain what they intend to do¨

def classify_block_type(is_bold: bool, font_size: int, body_size: float) -> str:
    """
    Classify using bold as the primary signal, size ratio as tiebreaker.

    body_size is the median font size of the document, which robustly
    represents normal paragraph text across varied paper formats.

      not bold, size <= body  →  p
      not bold, size >  body  →  h3
      bold,     ratio >= 1.6  →  h1
      bold,     ratio >= 1.2  →  h2
      bold,     ratio >= 1.0  →  h3
      bold,     ratio <  1.0  →  h4   (bold but smaller — figure labels etc.)
    """
    if not is_bold: 
        return "p" if font_size <= body_size else "h3"
    ratio = font_size / body_size if body_size else 1.0
    if ratio >= 1.6:
        return "h1"
    if ratio >= 1.2:
        return "h2"
    if ratio >= 1.0:
        return "h3"
    return "h4"
