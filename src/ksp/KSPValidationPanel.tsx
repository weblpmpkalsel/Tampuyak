import React, { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { enterpriseComplianceEngine } from '../enterprise/compliance/engine/ComplianceEngine';
import { ComplianceContext } from '../enterprise/compliance/ComplianceTypes';
import { useApp } from "../Tampuyak";

export const KSPValidationPanel = ({ onClose }: { onClose?: () => void }) => {
  const { settings } = useApp();

  const complianceContext: ComplianceContext = useMemo(() => ({
    documentType: 'KSP',
    metadata: settings
  }), [settings]);

  const complianceReport = useMemo(() => enterpriseComplianceEngine.execute(complianceContext), [complianceContext]);
  const validations = complianceReport.issues;

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Blocking': return 'bg-rose-50 border-rose-500 text-rose-900';
      case 'Quality': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'Attachment Required': return 'bg-purple-50 border-purple-500 text-purple-900';
      case 'Recommendation': return 'bg-blue-50 border-blue-500 text-blue-900';
      default: return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Blocking': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'Quality': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'Attachment Required': return <AlertTriangle className="w-5 h-5 text-purple-600" />;
      case 'Recommendation': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {onClose && (
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0">
          <button 
            onClick={onClose} 
            className="px-3 py-1.5 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>
      )}

      <div className="p-8 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 w-full">
       <div className="bg-white rounded-xl border border-[var(--color-eds-border)] p-8 shadow-sm">
         <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-black text-slate-800">Enterprise Validation Panel</h2>
           <div className="flex gap-4 text-sm font-medium">
             <span className={complianceReport.complianceScore === 100 ? "text-green-600" : "text-amber-600"}>
               Compliance Score: {complianceReport.complianceScore}%
             </span>
             <span className="text-slate-600">
               Completion Score: {complianceReport.completionScore}%
             </span>
           </div>
         </div>
         <p className="text-[var(--color-eds-text-secondary)] mb-8 font-medium">Hasil pengecekan kelengkapan dan kesesuaian KSP.</p>
         
         <div className="space-y-4">
           {validations.length > 0 ? validations.map((val) => (
             <div key={val.issueId} className={`p-4 border-l-4 rounded-r-lg ${getSeverityStyles(val.severity)}`}>
               <div className="flex items-start">
                 <div className="mr-3 mt-0.5">
                   {getSeverityIcon(val.severity)}
                 </div>
                 <div>
                   <h4 className="font-bold uppercase text-xs tracking-wider mb-1 flex items-center gap-2">
                     <span className="opacity-80">{val.title}</span>
                     <span className="text-[10px] bg-white/50 px-1.5 py-0.5 rounded border border-current/20">{val.severity}</span>
                     <span className="text-[10px] bg-white/50 px-1.5 py-0.5 rounded border border-current/20 opacity-70">{val.ruleId}</span>
                   </h4>
                   <p className="font-medium text-sm mb-1">{val.description}</p>
                   {val.recommendation && (
                     <p className="text-xs opacity-80 italic">Rekomendasi: {val.recommendation}</p>
                   )}
                 </div>
               </div>
             </div>
           )) : (
             <div className="p-4 border-l-4 rounded-r-lg bg-green-50 border-green-500 text-green-900">
               <div className="flex items-start">
                 <div className="mr-3 mt-0.5">
                   <ShieldCheck className="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <h4 className="font-bold uppercase text-xs tracking-wider mb-1 flex items-center gap-2">
                     <span className="opacity-80">All Checks Passed</span>
                   </h4>
                   <p className="font-medium text-sm">Tidak ada isu kepatuhan yang ditemukan. KSP siap untuk direviu dan dipublikasi.</p>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
      </div>
    </div>
  );
};
