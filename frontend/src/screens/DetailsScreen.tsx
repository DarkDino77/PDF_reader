import type React from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../hooks/useDocument';
import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import TextContent from '../components/organisms/TextContent';
import Spinner from '../components/atoms/Spinner';

const DetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { document, loading, error } = useDocument(id);

  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.7);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-400">
        <Spinner></Spinner>
        <p className="animate-pulse mt-4">Loading document...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-red-400 gap-2">
        <AlertCircle className="w-5 h-5"></AlertCircle>
        <p>{error ?? 'Docuemnt not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {!document.is_processed && (
        <div className="flex items-center justify-center gap-2 py-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin"></Loader2>
          <span></span>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-6 py-12">
        <TextContent
          blocks={document.blocks}
          fontSize={fontSize}
          lineHeight={lineHeight}
        ></TextContent>
      </main>
    </div>
  );
};

export default DetailsScreen;
