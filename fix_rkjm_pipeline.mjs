import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Replace tabs definition
code = code.replace(
  `  const tabs = [
    { id: "penyusunan", label: "Penyusunan", icon: GitCommit },
    { id: "pratinjau", label: "Pratinjau Dokumen", icon: FileText },
    { id: "review", label: "Review", icon: CheckCircle2 },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "cetak", label: "Cetak & Ekspor", icon: Printer },
  ];`,
  `  const tabs = [
    { id: "pratinjau", label: "Preview", icon: FileText },
    { id: "review", label: "Review", icon: CheckCircle2 },
    { id: "bandingkan", label: "Bandingkan Versi", icon: GitCompare },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "cetak", label: "Cetak & Ekspor", icon: Printer },
    { id: "arsipkan", label: "Arsipkan", icon: Archive },
  ];`
);

// Remove activeTab === "penyusunan" block
// It starts with `{activeTab === "penyusunan" && (`
// Let's just find and slice it out.
const penyusunanStart = code.indexOf('{activeTab === "penyusunan" && (');
if (penyusunanStart !== -1) {
  const penyusunanEnd = code.indexOf(')}', code.indexOf('</Card>', penyusunanStart)) + 2;
  if (penyusunanEnd > 2) {
    code = code.substring(0, penyusunanStart) + code.substring(penyusunanEnd);
  }
}

// Add imports if needed. We need GitCompare, Archive.
// Let's check if they exist.
if (!code.includes('Archive')) {
  code = code.replace('Printer,', 'Printer, Archive, GitCompare,');
}

// Update Document Info Sidebar
// Currently:
/*
          <div className="xl:col-span-3 space-y-4 sticky top-4">
             <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
               <h3 className="font-bold text-slate-700 mb-4 px-2">Navigasi Dokumen</h3>
               ...
             </div>
             
             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
               ...
             </div>
          </div>
*/

// Let's replace the bg-slate-50 block with Document Information.
const oldStatusRenderer = `<div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Status Rendering</p>
               <div className="space-y-2 text-sm text-slate-600">
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> Cover</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> Lembar Pengesahan</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> Daftar Isi</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> BAB I - V</span></div>
               </div>
             </div>`;

const newDocInfo = `<div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
               <h3 className="font-bold text-slate-700 mb-4 px-2">Informasi Dokumen</h3>
               <div className="space-y-3 px-2 text-sm">
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase mb-1">Status Dokumen</p>
                   <p className="font-medium text-amber-600">Draft</p>
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase mb-1">Versi</p>
                   <p className="font-medium text-slate-700">1.0</p>
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase mb-1">Persetujuan</p>
                   <p className="font-medium text-slate-700">Belum Disetujui</p>
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-bold uppercase mb-1">Revisi Terakhir</p>
                   <p className="font-medium text-slate-700">12 Juni 2026 (Baru Saja)</p>
                 </div>
                 <div className="pt-2 border-t border-slate-100">
                   <p className="text-slate-400 text-xs font-bold uppercase mb-2">Dokumen Terkait</p>
                   <div className="flex gap-2">
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">RKT</span>
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">RKAS</span>
                   </div>
                 </div>
               </div>
             </div>`;

code = code.replace(oldStatusRenderer, newDocInfo);

// Handle new tabs empty states
const newTabsContent = `

      {activeTab === "bandingkan" && (
        <Card title="Bandingkan Versi" icon={GitCompare} description="Lihat perbedaan antar versi dokumen.">
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
             <GitCompare className="w-10 h-10 mb-4 text-slate-300" />
             <p className="font-bold">Mode Perbandingan</p>
             <p className="text-sm">Fitur perbandingan revisi akan aktif setelah ada lebih dari satu versi.</p>
           </div>
        </Card>
      )}

      {activeTab === "arsipkan" && (
        <Card title="Arsipkan Dokumen" icon={Archive} description="Simpan dokumen ke dalam arsip sekolah.">
           <div className="p-6 border-2 border-slate-200 rounded-2xl">
             <h3 className="font-bold text-slate-800 text-lg mb-2">Kunci dan Arsipkan</h3>
             <p className="text-sm text-slate-500 mb-6">Dokumen yang diarsipkan tidak dapat diubah lagi dan akan menjadi rekaman permanen.</p>
             <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">Arsipkan RKJM</Button>
           </div>
        </Card>
      )}
`;

code = code.replace('{activeTab === "review" && (', newTabsContent + '\n      {activeTab === "review" && (');

// And remove the "Pipeline Engine" states since they are no longer used
code = code.replace(
  `// Penyusunan Pipeline State
  const [activeStep, setActiveStep] = useState(0);
  const progressPercent = Math.round((activeStep / (RKJMPipelineEngine.Steps.length - 1)) * 100) || 0;
  const currentStepData = RKJMPipelineEngine.Steps[activeStep];
  
  const handleNextStep = () => {
    if (activeStep < RKJMPipelineEngine.Steps.length - 1) setActiveStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };`,
  `// Lifecycle states (moved to upper management layer conceptually)`
);

// For Riwayat, let's update it to look like a timeline
const riwayatStart = code.indexOf('{activeTab === "riwayat" && (');
if (riwayatStart !== -1) {
  const riwayatEnd = code.indexOf(')}', code.indexOf('</Card>', riwayatStart)) + 2;
  const riwayatReplacement = `{activeTab === "riwayat" && (
        <Card title="Riwayat Aktivitas Dokumen" icon={History} description="Lacak semua perubahan dan persetujuan.">
           <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-4 mt-4">
             <div className="relative">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[23px] top-1.5 ring-4 ring-white"></div>
                <p className="text-sm font-bold text-slate-800">Direvisi oleh Tim Pengembang</p>
                <p className="text-xs text-slate-500 mt-1">12 Juni 2026, 14:30 • Draft (v1.2)</p>
             </div>
             <div className="relative">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[23px] top-1.5 ring-4 ring-white"></div>
                <p className="text-sm font-bold text-slate-800">Direview oleh Kepala Sekolah</p>
                <p className="text-xs text-slate-500 mt-1">10 Juni 2026, 09:15 • Catatan: Tambahkan program literasi.</p>
             </div>
             <div className="relative">
                <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[23px] top-1.5 ring-4 ring-white"></div>
                <p className="text-sm font-bold text-slate-800">RKJM Dibuat</p>
                <p className="text-xs text-slate-500 mt-1">1 Juni 2026, 10:00 • Sistem</p>
             </div>
           </div>
        </Card>
      )}`;
  code = code.substring(0, riwayatStart) + riwayatReplacement + code.substring(riwayatEnd);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
