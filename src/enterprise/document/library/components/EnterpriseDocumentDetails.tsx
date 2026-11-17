import React from 'react';
import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';
import { ArrowLeft, FileText, Calendar, Hash, Tag, Layers, Link as LinkIcon, User } from 'lucide-react';

interface Props {
  document: EnterpriseDocumentModel;
  onBack: () => void;
}

export const EnterpriseDocumentDetails: React.FC<Props> = ({ document, onBack }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
              <p className="text-sm text-gray-500">{document.id}</p>
            </div>
          </div>
        </div>
        {!(document.status === 'DRAFT' && document.title.toLowerCase().includes('intrakurikuler')) && (
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            document.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
            document.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {document.status}
          </span>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {document.description || 'Tidak ada deskripsi.'}
            </p>
          </section>
          
          {document.content && (
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Pratinjau Konten</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm overflow-auto max-h-96">
                <pre className="text-gray-700">{JSON.stringify(document.content, null, 2)}</pre>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Referensi</h3>
            {document.referencedBy.length > 0 ? (
              <ul className="space-y-2">
                {document.referencedBy.map((ref, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Modul: {ref.moduleId}</p>
                      {ref.referenceContext && <p className="text-xs text-gray-500">{ref.referenceContext}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Tidak ada referensi yang ditemukan untuk dokumen ini.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Layers className="w-4 h-4" /> Domain</span>
                <span className="font-medium text-gray-900">{document.knowledgeDomain}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Category</span>
                <span className="font-medium text-gray-900">{document.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Hash className="w-4 h-4" /> Version</span>
                <span className="font-medium text-gray-900">v{document.version}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><User className="w-4 h-4" /> Owner</span>
                <span className="font-medium text-gray-900">{document.owner}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Source</span>
                <span className="font-medium text-gray-900">{document.source}</span>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Riwayat</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dibuat</p>
                  <p className="text-xs text-gray-500">{new Date(document.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Terakhir Diperbarui</p>
                  <p className="text-xs text-gray-500">{new Date(document.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
