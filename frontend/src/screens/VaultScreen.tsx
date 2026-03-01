// src/screens/VaultScreen.tsx
import React from 'react';
import { useDocuments } from '../hooks/useDocuments';
import  DocumentTable  from '../components/organisms/DocumentTable';
import  UploadButton  from '../components/molecules/UploadButton';

const VaultScreen: React.FC = () => {
  const { documents, loading, error, refresh, removeDocument } = useDocuments();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-500/30">
    <div className="w-full px-6 py-8 lg:px-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">

        <div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              MY <span className="text-blue-500">VAULT</span>
            </h1>
            <p className="text-neutral-500 font-medium mt-2">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} stored in library
            </p>
          </div>
          <div className="flex items-center gap-4">
        <UploadButton onUploadSuccess={refresh} />
        </div>
      </header>
      
      <main className="w-full bg-neutral-900/50 rounded-2xl border border-neutral-800 shadow-2xl backdrop-blur-sm overflow-hidden">
        <DocumentTable 
          documents={documents}
          loading={loading}
          error={error}
          onDelete={removeDocument}
        />
      </main>
    </div>
    </div>
  );
};

export default VaultScreen;