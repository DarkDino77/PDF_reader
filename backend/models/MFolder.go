package models

import "gorm.io/gorm"

type Folder struct {
	gorm.Model
	Name      string     `json:"name"`
	ParentID  *uint      `json:"parent_id"`
	Documents []Document `json:"documents"`
}
