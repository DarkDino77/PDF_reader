import { useCallback, useEffect, useState } from "react"
import type { DocumentResponse } from "../types/api"
import { documentApi } from "../api/documentApi";


export const useDocuments = () => {
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null); 

    const fetchDocs = useCallback(async () => {
        try {
            const data = await documentApi.getAllDocuments();
            setDocuments(data)
        } catch(err){
            setError("failed to load documents");
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);

    useEffect(() => {
        const hasUnprocessed = documents.some(doc => !doc.is_processed);

        if (hasUnprocessed){
            const interval = setInterval(fetchDocs, 3000);
            return() => clearInterval(interval);
        }
    }, [documents, fetchDocs]);

    const removeDocument = async (id:number) => {
        try {
            await documentApi.delete(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id))    
        } catch (error) {
            alert("Delete failed")
        }

    };

    return {documents, loading, error, refresh: fetchDocs, removeDocument};
};