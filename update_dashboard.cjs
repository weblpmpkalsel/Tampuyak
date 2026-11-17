const fs = require('fs');

const code = `import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Eye, ShieldCheck, Paperclip, FileText, Download, Settings, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { EnterpriseConfigurationCenter } from '../enterprise/configuration/EnterpriseConfigurationCenter';

export const KSPDashboard = ({ onOpenPreview, onOpenValidation, onOpenAttachments }: { onOpenPreview: () => void, onOpenValidation: () => void, onOpenAttachments: () => void }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-8 max-w-7xl mx-auto">
      
      {/* ENTERPRISE STATUS CARD & HEADER */}
      <div className="bg-white border-t-4 border-indigo-800 rounded-xl shadow-sm flex flex-col gap-6 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 uppercase text-gray-900">
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
              Last Generated: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">School Name</p>
            <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.schoolName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Academic Year</p>
            <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.academicYear}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Education Level</p>
            <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.schoolName.includes("SMP") ? "SMP (Fase D)" : "SMA (Fase E/F)"}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Region</p>
            <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.regencyOrCity}, {EnterpriseConfigurationCenter.province}</p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Principal</p>
            <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.principalName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Supervisor</p>
            <p className="font-bold text-gray-900">{EnterpriseConfigurationCenter.supervisorName}</p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex items-center justify-between text-sm">
           <div>
            <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Validation</p>
            <p className="font-bold text-emerald-600 text-lg">100% Passed</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button onClick={onOpenPreview} className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors shadow-md group">
              <Eye className="w-10 h-10 text-white mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-lg">Preview Document</span>
            </button>
            <button onClick={onOpenValidation} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm group">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-900 group-hover:text-emerald-700">Validation</span>
            </button>
            <button onClick={onOpenAttachments} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm group">
              <Paperclip className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-900 group-hover:text-amber-700">Attachments</span>
            </button>
            
            <button disabled className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-xl opacity-80 cursor-not-allowed">
              <div className="relative">
                <FileText className="w-8 h-8 text-gray-400 mb-3" />
                <Lock className="w-4 h-4 text-gray-500 absolute -bottom-1 -right-1 bg-gray-50 rounded-full" />
              </div>
              <span className="font-bold text-gray-900">Publish PDF</span>
              <span className="text-xs text-gray-500 mt-1 font-medium text-center">🔒 Attachments Required<br/>Please upload all mandatory attachments.</span>
            </button>
            <button disabled className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-xl opacity-80 cursor-not-allowed">
              <div className="relative">
                <Download className="w-8 h-8 text-gray-400 mb-3" />
                <Lock className="w-4 h-4 text-gray-500 absolute -bottom-1 -right-1 bg-gray-50 rounded-full" />
              </div>
              <span className="font-bold text-gray-900">Publish DOCX</span>
              <span className="text-xs text-gray-500 mt-1 font-medium text-center">🔒 Attachments Required<br/>Please upload all mandatory attachments.</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm group">
              <Settings className="w-8 h-8 text-gray-600 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-900">KSP Settings</span>
            </button>
          </div>
        </div>

        {/* DOCUMENT STATUS */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Document Progress</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-black text-gray-900">88%</span>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">On Track</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Completed</span>
                <span className="font-bold text-gray-900">8 Sections</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Pending</span>
                <span className="font-bold text-amber-600">1 Attachment</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Blocked</span>
                <span className="font-bold text-gray-400">0</span>
              </div>
            </div>

            <hr className="my-5 border-gray-200" />
            
            <div className="space-y-3">
              {[
                { title: "BAB I - BAB V", status: "Complete", icon: CheckCircle2, color: "text-emerald-600" },
                { title: "Table of Contents", status: "Complete", icon: CheckCircle2, color: "text-emerald-600" },
                { title: "Attachments", status: "Pending", icon: AlertTriangle, color: "text-amber-600" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 text-sm">{item.title}</span>
                  <span className={\`inline-flex items-center text-xs font-bold \${item.color}\`}>
                    <item.icon className="w-3.5 h-3.5 mr-1.5" /> {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/ksp/KSPDashboard.tsx', code);
console.log("Updated Dashboard");
