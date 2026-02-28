package models

import (
	"gorm.io/gorm"
)

type Document struct {
	gorm.Model
	Title       string `json:"title"`
	FilePath    string `json:"file_path" gorm:"uniqueIndex"`
	FolderID    *uint  `json:"folder_id"`
	IsProcessed bool   `json:"is_processed" gorm:"default:false"`

	Blocks []TextBlock `json:"blocks" gorm:"constraint:onDelete:CASCADE;"`
}
