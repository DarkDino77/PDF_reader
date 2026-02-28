package main

import (
	"hello/database"
	"hello/routes"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	container := NewAppContainer()

	go func() {

		time.Sleep(10 * time.Second)
		container.DocController.Service.RunJanitor()

		ticker := time.NewTicker(24 * time.Hour)
		for range ticker.C {
			container.DocController.Service.RunJanitor()
		}
	}()

	r := routes.SetupRouter(container.DocController)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
