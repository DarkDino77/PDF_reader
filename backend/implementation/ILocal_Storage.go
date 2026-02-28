package implementation

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type LocalStorage struct {
	BaseDir string
}

func (l *LocalStorage) Save(fileName string, content io.Reader) (string, error) {

	if err := os.MkdirAll(l.BaseDir, 0755); err != nil {
		return "", fmt.Errorf("storage: failed to ensure directory %s: %w", l.BaseDir, err)
	}

	fullPath := filepath.Join(l.BaseDir, fileName)
	out, err := os.Create(fullPath)
	if err != nil {
		return "", err
	}
	defer out.Close()
	_, err = io.Copy(out, content)
	return fullPath, err
}

func (l *LocalStorage) Delete(FilePath string) error {
	return os.Remove(FilePath)
}
