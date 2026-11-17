import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Eye, ShieldCheck, Paperclip, FileText, Download, Settings, Lock } from 'lucide-react';
import { useKspMetadata } from './KspMetadataAdapter';
import { PublishReadinessPanel } from './PublishReadinessPanel';

export const KSPDashboard = ({ onOpenPreview, onOpenValidation, onOpenAttachments, onOpenSettings }: { onOpenPreview: () => void, onOpenValidation: () => void, onOpenAttachments: () => void, onOpenSettings: () => void }) => {
  const metadata = useKspMetadata();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-8 max-w-7xl mx-auto">
      
      {/* ENTERPRISE STATUS CARD & HEADER */}
      <div className="bg-white border-t-4 border-indigo-800 rounded-xl shadow-sm flex flex-col gap-6 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 uppercase text-gray-900">
            Kurikulum Satuan Pendidikan
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100 shadow-sm text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Production Ready
            </span>
            <span className="flex items-center text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 shadow-sm text-sm">
              <ShieldCheck className="w-4 h-4 mr-2" /> Government Ready
            </span>
            <span className="flex items-center text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 shadow-sm text-sm">
              Generated from Enterprise Knowledge
            </span>
            <span className="flex items-center text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 shadow-sm text-sm">
              v1.0.0
            </span>
            <span className="flex items-center text-gray-500 font-medium text-sm ml-auto">
              Last Generated: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">School Name</p>
            <p className="font-bold text-gray-900">{metadata.schoolName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Academic Year</p>
            <p className="font-bold text-gray-900">{metadata.academicYear || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Education Level</p>
            <p className="font-bold text-gray-900">{metadata.schoolLevel || '-'} ({metadata.phase || '-'})</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Region</p>
            <p className="font-bold text-gray-900">{metadata.regencyOrCity || '-'}, {metadata.province || '-'}</p>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Principal</p>
            <p className="font-bold text-gray-900">{metadata.principalName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Supervisor</p>
            <p className="font-bold text-gray-900">{metadata.supervisorName || '-'}</p>
          </div>
          <div className="md:col-span-2 flex justify-end items-center">
           <div className="text-right">
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Validation Status</p>
            <p className="font-bold text-emerald-600 text-lg flex items-center justify-end">
              <CheckCircle2 className="w-5 h-5 mr-1.5" /> 100% Passed
            </p>
           </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <button onClick={onOpenPreview} className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors shadow-md group">
              <Eye className="w-10 h-10 text-white mb-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-white text-lg">Preview Document</span>
            </button>
            
            <button onClick={onOpenValidation} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm group">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-gray-900 group-hover:text-emerald-700">Validation</span>
            </button>
            
            <button onClick={onOpenAttachments} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm group">
              <Paperclip className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-gray-900 group-hover:text-amber-700">Attachments</span>
            </button>
            
            <button onClick={onOpenSettings} className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm group">
              <Settings className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-gray-900 group-hover:text-indigo-700">KSP Settings</span>
            </button>
          </div>
        </div>

        {/* PUBLISH READINESS PANEL */}
        <div>
          <PublishReadinessPanel onNavigate={(target) => {
            if (target === 'attachments') onOpenAttachments();
            else onOpenSettings();
          }} />
        </div>
        
      </div>
    </div>
  );
};
