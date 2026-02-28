package controllers

import (
	"fmt"
	"hello/dtos"
	"hello/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DocumentController struct {
	Service *services.DocumentService
}

func (dc *DocumentController) UploadDocument(c *gin.Context) {
	var input dtos.DocumentUploadRequest

	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return

	}

	file, err := input.File.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not open file"})
		return
	}

	defer file.Close()

	doc, err := dc.Service.HandleDocumentUpload(input.File.Filename, file, input.FolderID)
	if err != nil {
		fmt.Println("UPLOAD ERROR:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, dtos.MapDocumentToDTO(doc))
}

func (dc *DocumentController) DeleteDocument(c *gin.Context) {
	var input dtos.DocumentRequest

	if err := c.ShouldBindUri(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := dc.Service.Delete(input.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Document and associated files deleted successfully"})
}

func (dc *DocumentController) GetAllDocuments(c *gin.Context) {
	docs, err := dc.Service.GetAllDocuments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch documents"})
		return
	}

	response := make([]dtos.DocumentResponse, len(docs))
	for i := range docs {
		response[i] = dtos.MapDocumentToDTO(&docs[i])
	}

	c.JSON(http.StatusOK, response)

}

func (dc *DocumentController) GetDocument(c *gin.Context) {
	var input dtos.DocumentRequest
	if err := c.ShouldBindUri(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	doc, err := dc.Service.GetDocumentById(input.Id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Docment not found"})
		return
	}

	c.JSON(http.StatusOK, dtos.MapDocumentToDTO(doc))

}

func (dc *DocumentController) ReprocessDocument(c *gin.Context) {
	var input dtos.DocumentRequest
	if err := c.ShouldBindUri(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := dc.Service.Reprocess(input.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Re-proccessing triggerd"})
}
