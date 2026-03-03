import Button from '../atoms/Button';
import type { DocumentResponse } from '../../types/api';
import {
  FileText,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentRow from '../molecules/DocumentRow';

interface DocumentTableProps {
  documents: DocumentResponse[];
  onDelete: (id: number) => void;
  loading: boolean;
  error: string | null;
}

const DocumentTable = ({
  documents,
  onDelete,
  loading,
  error,
}: DocumentTableProps) => {
  if (loading && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500"></Loader2>
        <p className="animate-pulse">Accessing your vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-400 gap-2">
        <AlertCircle className="w-5 h-5"></AlertCircle>
        <p>{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-500 border-2 border-dashed border-neutral-800 rounded-xl m-4">
        <p>Your vault is empty. Upload a PDF to start reading.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/50">
            <th className="w-[70%] px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider">
              Document
            </th>
            <th className="w-[15%] px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="w-[15%] px-6 py-4 text-sm font-semibold text-neutral-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
