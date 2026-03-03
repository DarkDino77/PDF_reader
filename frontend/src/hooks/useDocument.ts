import { useCallback, useEffect, useState } from "react";
import type { DocumentDetailResponse } from "../types/api";
import { documentApi } from "../api/documentApi";

export const useDocument = (id: string | undefined) => {
    const [document , setDocument] = useState<DocumentDetailResponse|null>(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string|null>(null);
    
    const fetchDocument = useCallback(async ()=>{
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            setDocument(await documentApi.getDocument(id))    
        } catch{
            setError("Failed to load document.");
        } finally {
            setLoading(false)
        }

    },[id]);

    useEffect(()=> {fetchDocument();}, [fetchDocument]);

    useEffect(()=>{
        if (!document || document.is_processed) return
        const interval = setInterval(fetchDocument,3000)
        return ()=> clearInterval(interval)
    },[document, fetchDocument]);
    return {document, loading,error}
};

