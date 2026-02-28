package database

import (
	"fmt"
	"hello/models"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)

	var err error

	for i := 1; i <= 5; i++ {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Attempt %d: Failed tp connect to database. Retrying in 2 seconds....", i)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("Databse connection successfully opened")

	err = DB.AutoMigrate(&models.Folder{}, &models.TextBlock{}, &models.Document{}, &models.OrphanedFile{})

	if err != nil {
		log.Fatalf("Failed to run databse migrations: %v", err)
	}
	log.Println("Database migrated")

}
