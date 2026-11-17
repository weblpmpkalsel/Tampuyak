import React from 'react';
import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';
import { FileText, Clock, Hash, Tag, Layers, Link as LinkIcon } from 'lucide-react';

interface Props {
  document: EnterpriseDocumentModel;
  onClick: (doc: EnterpriseDocumentModel) => void;
}

export const EnterpriseDocumentCard: React.FC<Props> = ({ document, onClick }) => {
  return (
    <div 
      onClick={() => onClick(document)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{document.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{document.description || 'Tidak ada deskripsi tersedia'}</p>
          </div>
        </div>
        {!(document.status === 'DRAFT' && document.title.toLowerCase().includes('intrakurikuler')) && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            document.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
            document.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
            document.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {document.status}
          </span>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span>v{document.version}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate">{document.knowledgeDomain}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          <span>{document.category}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
          <span>{document.referenceCount} Ref</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{new Date(document.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  );
};
