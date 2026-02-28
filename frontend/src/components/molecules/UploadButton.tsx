import React, { useRef } from "react";
import Button from '../atoms/Button';
import { useFileUpload } from "../../hooks/useFileUpload";

interface UploadButtonProps{
    folderId?:number;
    onUploadSuccess?: (doc: any) => void;
}

const UploadButton = ({folderId, onUploadSuccess}: UploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { upload, isUploading } = useFileUpload(onUploadSuccess);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        await upload(file, folderId);
        if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
        alert("Failed to upload document.");
    }
    };
    return ( 
        <div className="inline-block">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hdden"
            />
            <Button
                variant="primary"
                isLoading={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="shadow-sm"
            >
                {isUploading ? "uploading...": "upload pdf"}
            </Button>

        </div>

    );
};

export default UploadButton