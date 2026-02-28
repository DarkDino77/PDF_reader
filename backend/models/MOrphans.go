package models

import "gorm.io/gorm"

type OrphanedFile struct {
	gorm.Model
	FilePath   string `gorm:"uniqueIndex"`
	Reason     string
	RetryCount int `gorm:"default:0"`
}
