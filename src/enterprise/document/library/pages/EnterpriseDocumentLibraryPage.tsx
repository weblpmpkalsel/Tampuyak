import React, { useState, useMemo } from 'react';
import { useEnterpriseDocuments } from '../hooks/useEnterpriseDocuments';
import { EnterpriseDocumentList } from '../components/EnterpriseDocumentList';
import { EnterpriseDocumentDetails } from '../components/EnterpriseDocumentDetails';
import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';
import { EnterpriseKnowledgeCategory } from '../../../knowledge/types/EnterpriseKnowledgeCategory';
import { DocumentStatus } from '../types/EnterpriseDocumentTypes';
import { Layers, FileText, FileCode, CheckSquare, Calendar, Mail, Archive, Folder } from 'lucide-react';

type SidebarFilter = 'ALL' | 'PROGRAMS' | 'TEMPLATES' | 'GUIDELINES' | 'CALENDARS' | 'LETTERS' | 'ARCHIVE';

export const EnterpriseDocumentLibraryPage: React.FC = () => {
  const { documents, loading } = useEnterpriseDocuments();
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>('ALL');
  const [selectedDocument, setSelectedDocument] = useState<EnterpriseDocumentModel | null>(null);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (activeFilter === 'ARCHIVE') {
        return doc.status === DocumentStatus.ARCHIVED;
      }
      
      // If we are not in Archive, hide archived documents by default
      if (doc.status === DocumentStatus.ARCHIVED) {
        return false;
      }

      switch (activeFilter) {
        case 'ALL':
          return true;
        case 'PROGRAMS':
          return doc.category === EnterpriseKnowledgeCategory.PROGRAM;
        case 'TEMPLATES':
          return doc.category === EnterpriseKnowledgeCategory.TEMPLATE;
        case 'GUIDELINES':
          return doc.category === EnterpriseKnowledgeCategory.GUIDELINE;
        case 'CALENDARS':
          return doc.category === EnterpriseKnowledgeCategory.CALENDAR;
        case 'LETTERS':
          return doc.category === EnterpriseKnowledgeCategory.LETTER;
        default:
          return true;
      }
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [documents, activeFilter]);

  const sidebarItems = [
    { id: 'ALL', label: 'Semua Dokumen', icon: Layers },
    { id: 'PROGRAMS', label: 'Program', icon: FileText },
    { id: 'TEMPLATES', label: 'Templat', icon: FileCode },
    { id: 'GUIDELINES', label: 'Pedoman', icon: CheckSquare },
    { id: 'CALENDARS', label: 'Kalender', icon: Calendar },
    { id: 'LETTERS', label: 'Surat', icon: Mail },
    { id: 'ARCHIVE', label: 'Arsip', icon: Archive },
  ] as const;

  if (selectedDocument) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <EnterpriseDocumentDetails 
          document={selectedDocument} 
          onBack={() => setSelectedDocument(null)} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <Folder className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900">Pustaka Dokumen</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {sidebarItems.find(i => i.id === activeFilter)?.label}
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
            <span>+</span> Dokumen Baru
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <EnterpriseDocumentList 
              documents={filteredDocuments} 
              loading={loading}
              onDocumentClick={setSelectedDocument}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
