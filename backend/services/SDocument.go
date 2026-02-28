package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"hello/database"
	"hello/models"
	"io"
	"net/http"
	"os"

	"github.com/google/uuid"
)

type StorageProvider interface {
	Save(fileName string, content io.Reader) (string, error)
	Delete(filepath string) error
}

type DocumentService struct {
	Storage StorageProvider
}

func (s *DocumentService) GetAllDocuments() ([]models.Document, error) {
	var docs []models.Document

	err := database.DB.Order("created_at desc").Find(&docs).Error
	return docs, err
}

func (s *DocumentService) GetDocumentById(id uint) (*models.Document, error) {
	var doc models.Document

	if err := database.DB.First(&doc, id).Error; err != nil {
		return nil, err
	}

	return &doc, nil

}

func (s *DocumentService) HandleDocumentUpload(fileName string, fileReader io.Reader, folderID *uint) (*models.Document, error) {

	uniqueID := uuid.New().String()

	storageName := fmt.Sprintf("%s-%s", uniqueID, fileName)
	fullPath, err := s.Storage.Save(storageName, fileReader)
	if err != nil {
		return nil, fmt.Errorf("failed to save file: %w", err)
	}
	// Move to Services
	// DTO HERE // proboly not
	doc := models.Document{
		Title:    fileName,
		FilePath: fullPath,
		FolderID: folderID,
	}

	if err := database.DB.Create(&doc).Error; err != nil {
		return nil, err
	}

	go s.ProcessWithPython(doc.ID, fullPath)
	return &doc, nil
}

func (s *DocumentService) Delete(docID uint) error {

	var doc models.Document

	if err := database.DB.First(&doc, docID).Error; err != nil {
		return fmt.Errorf("document not found: %w", err)
	}

	if err := s.Storage.Delete(doc.FilePath); err != nil {

		database.DB.Create(&models.OrphanedFile{
			FilePath: doc.FilePath,
			Reason:   err.Error(),
		})
		fmt.Printf("Warning: Failed to delete physical file: %v\n", err)
	}

	if err := database.DB.Delete(&doc).Error; err != nil {
		return err
	}

	return nil
}

func (s *DocumentService) Reprocess(docID uint) error {
	var doc models.Document
	if err := database.DB.First(&doc, docID).Error; err != nil {
		return err
	}

	database.DB.Where("document_id = ?", docID).Delete(&models.TextBlock{})
	database.DB.Model(&doc).Update("IsProcessed", false)

	go s.ProcessWithPython(docID, doc.FilePath)
	return nil
}

func (s *DocumentService) ProcessWithPython(docID uint, path string) {
	pythonWorkerURL := os.Getenv("PYTHON_WORKER_URL")

	jsonData := map[string]string{"file_path": path}
	jsonValue, _ := json.Marshal(jsonData)

	APICall := fmt.Sprintf("%s/process-pdf", pythonWorkerURL)
	resp, err := http.Post(APICall, "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		fmt.Println("Error connectiong to Python service:", err)
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Python worker failed with status: %d\n", resp.StatusCode)
		return // Don't mark as processed if it failed!
	}
	// DTO HERE
	var result struct {
		Blocks []struct {
			Content   string  `json:"content"`
			FontSize  float64 `json:"font_size"`
			Page      int     `json:"page"`
			BlockType string  `json:"block_type" `
		} `json:"blocks"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	for i, b := range result.Blocks {
		block := models.TextBlock{
			DocumentID: docID,
			Content:    b.Content,
			SortOrder:  i,
			BlockType:  b.BlockType,
		}
		database.DB.Create(&block)
	}

	database.DB.Model(&models.Document{}).Where("id = ?", docID).Update("IsProcessed", true)
}

func (s *DocumentService) RunJanitor() {
	var orphans []models.OrphanedFile

	database.DB.Where("retry_count < ?", 5).Find(&orphans)

	for _, orphan := range orphans {
		err := s.Storage.Delete(orphan.FilePath)
		if err == nil {
			database.DB.Unscoped().Delete(&orphan)
		} else {
			database.DB.Model(&orphan).Update("RetryCount", orphan.RetryCount+1)
		}
	}
}
