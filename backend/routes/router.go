package routes

import (
	"hello/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(docController *controllers.DocumentController) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	api := r.Group("/PDF")
	{
		api.GET("/ping", func(ctx *gin.Context) {
			ctx.JSON(200, gin.H{"message": "pong"})
		})
		api.POST("/documents", docController.UploadDocument)
		api.DELETE("/documents/:id", docController.DeleteDocument)
		api.POST("/documents/:id/reprocess", docController.ReprocessDocument)
		api.GET("/documents/:id", docController.GetDocument)
		api.GET("/documents", docController.GetAllDocuments)

	}
	return r
}
