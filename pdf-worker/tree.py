from models import DocumentNode

HEADING_RANK = {"h1": 1, "h2": 2, "h3": 3, "h4":4}


def build_document_tree(classified_blocks: list[dict])-> DocumentNode:


    root = DocumentNode(
        block_type="root", content="", font_size=0, page=0, sort_order=1,image=None
    )
    stack: list[DocumentNode] = [root]

    for block in classified_blocks:
        node = DocumentNode(
            block_type=block["block_type"],
            content=block["content"],
            font_size=block["font_size"],
            page=block["page"],
            sort_order=block["sort_order"],
            image=block.get("image")
        )

        if block["block_type"] in ("p", "caption", "figure", "table"):
            stack[-1].add_child(node)
        else: 
            current_rank = HEADING_RANK[block["block_type"]]
            while len (stack) > 1:
                top = stack[-1]
                if top.block_type == "root":
                    break
                if HEADING_RANK.get(top.block_type, 0) < current_rank:
                    break
                stack.pop()

            stack[-1].add_child(node)
            stack.append(node)

    return root