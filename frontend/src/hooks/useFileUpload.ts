import { useState } from 'react';
import { documentApi } from '../api/documentApi';

export const useFileUpload = (onSuccess?: (doc: any) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, folderId?: number) => {
    setIsUploading(true);
    setError(null);
    try {
      const response = await documentApi.upload(file, folderId);
      onSuccess?.(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
};