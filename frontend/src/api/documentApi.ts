import type{ DocumentDetailResponse, DocumentResponse } from "../types/api";

const  BASE_URL = "/PDF"

export const documentApi = {
    upload: async(file: File, folderId?: number): Promise<DocumentResponse> => {
        const formData = new FormData();
        formData.append("pdf", file);
        if (folderId) formData.append("folder_id", folderId.toString());

        const res = await fetch(`${BASE_URL}/documents`, {method: "POST", body: formData});
        if(!res.ok) throw new Error("Failed to fetch");
        
        return res.json();
    },

    getAllDocuments: async(): Promise<DocumentResponse[]> => {
        const res = await fetch(`${BASE_URL}/documents`, {method: "GET"});
        if(!res.ok) throw new Error("failed to fetch");
        return res.json();
    },

    delete: async (id: number): Promise<{message: string}> =>  {
        const res = await fetch(`${BASE_URL}/documents/${id}`, {method: "DELETE"})
        if (!res.ok) throw new Error("Delete Failed");
        return res.json();
    }

    getDocument: async (id: string): Promise<{doc: DocumentDetailResponse}> => {
        const res = await fetch(`${BASE_URL}/documents/${id}`, {method: "GET"});
        if (!res.ok) throw new Error("Could not get the document");
        
        return res.json();
        
    }

}