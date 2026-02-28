import type { DocumentResponse } from "../../types/api";

interface DocumentTableProps {
    documents: DocumentResponse[];
    onDelete:(id:number) => void;
    loading: boolean;
    error: string| null;   
}

export const DocumentTable = ({documents, onDelete, loading, error}:DocumentTableProps) =>{
    if(loading && document.length === 0 ){

        return ()

    }
};