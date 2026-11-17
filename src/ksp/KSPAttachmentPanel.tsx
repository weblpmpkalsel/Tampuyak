import React from 'react';
import { Paperclip, FileText, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import { Button } from '../components/ui/button';

import { ArrowLeft } from 'lucide-react';
export const KSPAttachmentPanel = ({ onClose }: { onClose?: () => void }) => {
  const attachments = [
    { name: 'Kalender Pendidikan', status: 'Missing', source: 'Unggah Manual', severity: 'Critical', type: 'Manual' },
    { name: 'SK Tim Pengembang Kurikulum', status: 'Missing', source: 'Unggah Manual', severity: 'Major', type: 'Manual' },
    { name: 'SK Penetapan Kurikulum', status: 'Missing', source: 'Unggah Manual', severity: 'Major', type: 'Manual' },
    { name: 'Jadwal Pelajaran', status: 'Available', source: 'Sinkronisasi Rapor Pendidikan', severity: 'Info', type: 'Generated' },
    { name: 'Berita Acara', status: 'Missing', source: 'Knowledge Builder', severity: 'Major', type: 'Generated' },
    { name: 'Dokumen Pendukung', status: 'Missing', source: 'Unggah Manual', severity: 'Minor', type: 'Manual' },
  ];

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
      <div className="p-8 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
       <div className="bg-white rounded-xl border border-[var(--color-eds-border)] p-8 shadow-sm">
         <h2 className="text-2xl font-black mb-2 text-slate-800">Smart Attachment Panel</h2>
         <p className="text-[var(--color-eds-text-secondary)] mb-8 font-medium">Kelola lampiran wajib KSP sesuai standar regulasi.</p>
         <div className="space-y-4">
           {attachments.map((att, i) => (
             <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
               <div className="flex items-center">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4">
                   <Paperclip className="w-5 h-5 text-slate-500" />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 flex items-center gap-2">
                     {att.name}
                     {att.status === 'Missing' ? (
                       <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded">Missing</span>
                     ) : (
                       <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Tersedia</span>
                     )}
                   </h4>
                   <span className="text-xs font-medium text-slate-500 flex items-center mt-1">
                     <Link2 className="w-3 h-3 mr-1" /> Sumber: {att.source}
                   </span>
                 </div>
               </div>
               <div className="flex space-x-2">
                 {att.type === 'Generated' ? (
                   <>
                     <Button size="sm" variant="outline">{att.status === 'Available' ? 'Refresh' : 'Generate'}</Button>
                     <Button size="sm" variant="outline" disabled={att.status === 'Missing'}>Preview</Button>
                   </>
                 ) : (
                   <>
                     <Button size="sm" variant={att.status === 'Available' ? "outline" : "default"}>
                       {att.status === 'Available' ? 'Replace' : 'Upload'}
                     </Button>
                     <Button size="sm" variant="outline" disabled={att.status === 'Missing'}>Preview</Button>
                   </>
                 )}
               </div>
             </div>
           ))}
         </div>
       </div>
    </div>
    </div>
  );
};
