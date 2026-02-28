// src/screens/VaultScreen.tsx
import React from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentTable } from '../components/organisms/DocumentTable';
import { UploadButton } from '../components/molecules/UploadButton';

const VaultScreen: React.FC = () => {
  const { refresh } = useDocuments();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="flex justify-between items-center border-b border-neutral-700 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-white">PDF <span className="text-blue-500">Vault</span></h1>
        <UploadButton onUploadSuccess={refresh} />
      </header>
      
      <main className="bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl overflow-hidden">
        <DocumentTable />
      </main>
    </div>
  );
};

export default VaultScreen;