from __future__ import annotations
from dataclasses import dataclass, field

@dataclass
class DocumentNode:
    block_type: str
    content: str
    font_size: float
    page: int
    sort_order: int
    image: str | None
    children: list[DocumentNode] = field(default_factory=list)
    parent: DocumentNode | None = field(default=None, repr=False)

    def add_child(self, node: DocumentNode) -> None:
        node.parent = self
        self.children.append(node)

    def to_flat_list(self) -> list[dict]:
        result: list[dict] = []
        self._collect_flat(result)
        return result
    
    def _collect_flat(self, acc: list[dict]) -> None:
        if self.block_type != "root":
            acc.append({
                "block_type": self.block_type,
                "content": self.content,
                "font_size": self.font_size,
                "page": self.page,
                "sort_order": self.sort_order,
                "image": self.image
            })

        for child in self.children:
            child._collect_flat(acc)