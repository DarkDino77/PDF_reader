package dtos

type TextBlockReponse struct {
	ID        uint    `json:"id"`
	Content   string  `json:"content"`
	BlockType string  `json:"block_type"`
	SortOrder int     `json:"sort_order"`
	FontSize  float64 `json:"font_size"`
}
