package models

import "gorm.io/gorm"

type TextBlock struct {
	gorm.Model
	DocumentID uint   `json:"document_id" gorm:"not null;index"`
	Content    string `json:"content" gorm:"type:text"`
	BlockType  string `json:"block_type"`
	SortOrder  int    `json:"sort_order"`
}
