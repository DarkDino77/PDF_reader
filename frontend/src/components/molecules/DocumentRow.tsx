import { useNavigate } from 'react-router-dom';
import type { DocumentResponse } from '../../types/api';
import StatusBadge from '../atoms/StatusBadge';
import Button from '../atoms/Button';
import { FileText, Trash2, ExternalLink } from 'lucide-react';

interface DocumentRowProps {
  document: DocumentResponse;
  onDelete: (id: number) => void;
}

const DocumentRow = ({ document, onDelete }: DocumentRowProps) => {
  const navigate = useNavigate();
  return (
    <tr className="hover:bg-neutral-800/40 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FileText className="w-5 h-5 text-blue-400"></FileText>
          </div>
          <span className="text-neutral-200 font-medium">{document.title}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge isProcessed={document.is_processed} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="h-9 px-3"
            title="Open Reader"
            onClick={() => navigate(`/document/${document.id}`)}
          >
            <ExternalLink className="w-4 h-4"></ExternalLink>
          </Button>
          <Button
            variant="danger"
            className="h-9 px-3"
            onClick={() => onDelete(document.id)}
          >
            <Trash2 className="w-4 h-4"></Trash2>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default DocumentRow;
