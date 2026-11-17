import React from 'react';
import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';
import { EnterpriseDocumentCard } from './EnterpriseDocumentCard';
import { Search } from 'lucide-react';

interface Props {
  documents: EnterpriseDocumentModel[];
  onDocumentClick: (doc: EnterpriseDocumentModel) => void;
  loading?: boolean;
}

export const EnterpriseDocumentList: React.FC<Props> = ({ documents, onDocumentClick, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Dokumen Tidak Ditemukan</h3>
        <p className="text-gray-500 mt-1">Tidak ada aset pengetahuan yang sesuai dengan kriteria Anda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map(doc => (
        <EnterpriseDocumentCard key={doc.id} document={doc} onClick={onDocumentClick} />
      ))}
    </div>
  );
};
