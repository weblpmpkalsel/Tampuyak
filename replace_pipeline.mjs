import fs from "fs";

let code = fs.readFileSync("src/Tampuyak.tsx", "utf8");
const lines = code.split("\n");

const startIndex = 8960; 
const endIndex = 9554; 

const replacement = `const RKJMPipelineView = () => {
  const { settings, showSuccess } = useApp();
  const [activeTab, setActiveTab] = useState("pratinjau");
  const [zoom, setZoom] = useState(100);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [activePageId, setActivePageId] = useState("cover");

  // Penyusunan Pipeline State
  const [activeStep, setActiveStep] = useState(0);
  const progressPercent = Math.round((activeStep / (RKJMPipelineEngine.Steps.length - 1)) * 100) || 0;
  const currentStepData = RKJMPipelineEngine.Steps[activeStep];
  
  const handleNextStep = () => {
    if (activeStep < RKJMPipelineEngine.Steps.length - 1) setActiveStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const tabs = [
    { id: "penyusunan", label: "Penyusunan", icon: GitCommit },
    { id: "pratinjau", label: "Pratinjau Dokumen", icon: FileText },
    { id: "review", label: "Review", icon: CheckCircle2 },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "cetak", label: "Cetak & Ekspor", icon: Printer },
  ];

  const outline = [
    { id: "cover", label: "Cover RKJM" },
    { id: "pengesahan", label: "Lembar Pengesahan" },
    { id: "daftar_isi", label: "Daftar Isi" },
    { id: "bab1", label: "BAB I: Pendahuluan" },
    { id: "bab2", label: "BAB II: Analisis Kondisi" },
    { id: "bab3", label: "BAB III: Program Kerja" },
    { id: "bab4", label: "BAB IV: Rencana Anggaran" },
    { id: "bab5", label: "BAB V: Penutup" },
    { id: "lampiran", label: "Lampiran" },
  ];

  // If Print mode, just render the document without any UI
  if (isPrintMode) {
    return (
      <div className="bg-white min-h-screen font-serif text-black p-8">
        <div className="max-w-[210mm] mx-auto space-y-24">
          {/* Print content goes here */}
          <div className="text-center pt-24 pb-32">
            <h1 className="text-4xl font-bold mb-4 uppercase">Rencana Kerja Jangka Menengah (RKJM)</h1>
            <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>
            <div className="mt-32 text-xl font-bold">
              <p>{settings.school?.name || "Nama Sekolah"}</p>
              <p>NPSN: {settings.school?.npsn || "-"}</p>
            </div>
          </div>
          <div className="page-break-before" style={{ pageBreakBefore: 'always' }}>
             <h3 className="text-2xl font-bold text-center mb-12">LEMBAR PENGESAHAN</h3>
             <p className="text-justify mb-12 leading-relaxed">Dokumen Rencana Kerja Jangka Menengah (RKJM) ini telah direview, disetujui dan disahkan untuk digunakan sebagai pedoman kerja sekolah.</p>
             <div className="grid grid-cols-2 gap-8 text-center mt-16">
               <div>
                 <p className="mb-24">Mengesahkan,<br/>Kepala Sekolah</p>
                 <p className="font-bold underline">{settings.principal?.name || "Belum diatur"}</p>
                 <p>NIP. {settings.principal?.nip || "-"}</p>
               </div>
               <div>
                 <p className="mb-24">Menyetujui,<br/>Ketua Komite</p>
                 <p className="font-bold underline">{settings.komite?.name || "Belum diatur"}</p>
               </div>
             </div>
          </div>
          {/* In a real app we'd render all BABs here */}
        </div>
        <div className="fixed top-4 right-4 print:hidden">
          <Button onClick={() => setIsPrintMode(false)} variant="outline" className="bg-white">Kembali</Button>
        </div>
        <style>{\`
          @media print {
            body * { visibility: hidden; }
            .print\\\\:hidden { display: none; }
            .max-w-\\\\[210mm\\\\] { max-w: none; }
            .max-w-\\\\[210mm\\\\] * { visibility: visible; }
            .max-w-\\\\[210mm\\\\] { position: absolute; left: 0; top: 0; }
          }
        \`}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header RKJM Info */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-1 flex items-center">
              RKJM
              <div className="ml-4 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 uppercase">
                Draft
              </div>
            </h1>
            <p className="text-slate-500 font-medium">Rencana Kerja Jangka Menengah</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0 text-right">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Versi</p>
               <p className="text-sm font-bold text-slate-700">1.0</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Tahun</p>
               <p className="text-sm font-bold text-slate-700">{settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Terakhir Diubah</p>
               <p className="text-sm font-bold text-slate-700">Baru Saja</p>
            </div>
          </div>
        </div>

        {/* Primary Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-100 pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={\`flex items-center px-5 py-3 font-bold text-sm transition-all border-b-2 \${activeTab === t.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}\`}
            >
              <t.icon className={\`w-4 h-4 mr-2 \${activeTab === t.id ? 'text-indigo-600' : 'text-slate-400'}\`} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "penyusunan" && (
        <Card title="Status Pipeline Penyusunan" icon={GitCommit} description="Proses di balik layar untuk merakit RKJM.">
           <div className="mb-8">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-bold text-slate-600">
                 Progress Perakitan
               </span>
               <span className="text-sm font-black text-indigo-600">
                 {progressPercent}%
               </span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
               <div
                 className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                 style={{ width: \`\${progressPercent}%\` }}
               ></div>
             </div>
           </div>

           <div className="flex flex-col md:flex-row gap-6 items-start">
             <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
               <div className="space-y-2">
                 {RKJMPipelineEngine.Steps.map((step, idx) => (
                   <button
                     key={step.id}
                     onClick={() => setActiveStep(idx)}
                     className={\`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center \${activeStep === idx ? "bg-indigo-100 text-indigo-800 border border-indigo-200" : idx < activeStep ? "text-emerald-600 bg-white border border-emerald-100" : "text-slate-500 hover:bg-slate-100 border border-transparent"}\`}
                   >
                     <span>{step.title}</span>
                     {idx < activeStep && (
                       <CheckCircle2 className="w-3.5 h-3.5" />
                     )}
                   </button>
                 ))}
               </div>
             </div>
             <div className="w-full md:w-2/3">
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                   <h3 className="font-bold text-lg mb-2">{currentStepData.title}</h3>
                   <p className="text-sm text-slate-500 mb-6">Status: <span className="font-medium text-slate-700">Dalam antrean</span></p>
                   
                   <div className="flex justify-between border-t border-slate-100 pt-4 mt-6">
                      <Button variant="outline" onClick={handlePrevStep} disabled={activeStep === 0}>Mundur</Button>
                      <Button onClick={handleNextStep} disabled={activeStep === RKJMPipelineEngine.Steps.length - 1} className="bg-indigo-600">Lanjut Proses</Button>
                   </div>
                </div>
             </div>
           </div>
        </Card>
      )}

      {activeTab === "pratinjau" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Navigation Sidebar */}
          <div className="xl:col-span-3 space-y-4 sticky top-4">
             <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
               <h3 className="font-bold text-slate-700 mb-4 px-2">Navigasi Dokumen</h3>
               <div className="space-y-1">
                 {outline.map((item) => (
                   <button 
                     key={item.id}
                     onClick={() => setActivePageId(item.id)}
                     className={\`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors \${activePageId === item.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}\`}
                   >
                     {item.label}
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Status Rendering</p>
               <div className="space-y-2 text-sm text-slate-600">
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> Cover</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> Lembar Pengesahan</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> Daftar Isi</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center"><Check className="w-3 h-3 text-emerald-500 mr-2"/> BAB I - V</span></div>
               </div>
             </div>
          </div>

          {/* Document Renderer Area */}
          <div className="xl:col-span-9 bg-slate-100 rounded-2xl border border-slate-200 p-6 flex flex-col items-center custom-scrollbar overflow-x-auto min-h-[800px]">
             
             {/* Toolbar Microsoft Word-like */}
             <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2 mb-6 flex items-center justify-between sticky top-0 z-10 w-full max-w-[210mm]">
                <div className="flex items-center gap-2">
                   <div className="px-3 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">A4 Portrait</div>
                   <div className="h-4 w-px bg-slate-200 mx-1"></div>
                   <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><ZoomOut className="w-4 h-4"/></button>
                   <span className="text-xs font-bold text-slate-600 w-12 text-center">{zoom}%</span>
                   <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><ZoomIn className="w-4 h-4"/></button>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => setIsReviewMode(!isReviewMode)} className={\`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors \${isReviewMode ? 'bg-amber-100 text-amber-700' : 'hover:bg-slate-100 text-slate-600'}\`}>
                     <Search className="w-3.5 h-3.5 mr-1.5" /> Review Mode
                   </button>
                </div>
             </div>

             {/* Document Page Canvas */}
             <div 
                className="bg-white shadow-xl transition-all duration-300 relative"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  transform: \`scale(\${zoom / 100})\`,
                  transformOrigin: 'top center',
                  marginBottom: \`\${(zoom/100) > 1 ? (zoom-100)*3 : 0}px\`
                }}
             >
                {isReviewMode && (
                  <div className="absolute top-4 right-4 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-[10px] text-amber-700 font-bold uppercase tracking-widest shadow-sm">
                    Track Changes Active
                  </div>
                )}
                
                {/* Simulated A4 Page Content based on activePageId */}
                <div className="p-[25mm] font-serif text-slate-800 leading-relaxed text-[11pt]">
                   {activePageId === "cover" && (
                     <div className="text-center pt-24 h-full flex flex-col items-center">
                       <h1 className="text-2xl font-bold mb-4">RENCANA KERJA JANGKA MENENGAH (RKJM)</h1>
                       <h2 className="text-xl mb-16">TAHUN {settings.academicYears?.find((y:any)=>y.isActive)?.name || "2024/2025"}</h2>
                       <div className="mt-32">
                         <p className="text-xl font-bold uppercase">{settings.school?.name || "NAMA SEKOLAH"}</p>
                         <p className="mt-2 text-sm text-slate-600">NPSN: {settings.school?.npsn || "-"}</p>
                         <p className="mt-4 text-sm max-w-sm mx-auto">{settings.school?.address || "Alamat sekolah belum diatur."}</p>
                       </div>
                     </div>
                   )}

                   {activePageId === "pengesahan" && (
                     <div>
                       <h3 className="text-center font-bold text-lg mb-12 uppercase">Lembar Pengesahan</h3>
                       <p className="text-justify mb-16">Dokumen Rencana Kerja Jangka Menengah (RKJM) {settings.school?.name || "Sekolah"} ini disusun sebagai pedoman arah kebijakan dan program strategis sekolah. Telah direview, disetujui, dan disahkan pada...</p>
                       <div className="grid grid-cols-2 gap-8 text-center text-sm">
                         <div>
                           <p className="mb-20">Mengesahkan,<br/>Kepala Sekolah</p>
                           <p className="font-bold underline">{settings.principal?.name || "Belum diatur"}</p>
                           <p>NIP. {settings.principal?.nip || "-"}</p>
                         </div>
                         <div>
                           <p className="mb-20">Menyetujui,<br/>Ketua Komite</p>
                           <p className="font-bold underline">{settings.komite?.name || "Belum diatur"}</p>
                         </div>
                       </div>
                     </div>
                   )}

                   {activePageId === "bab1" && (
                     <div>
                       <h3 className="text-center font-bold text-lg mb-6 uppercase">BAB I<br/>PENDAHULUAN</h3>
                       <p className="font-bold mb-2">1.1 Latar Belakang</p>
                       <p className="text-justify mb-4">
                         {isReviewMode ? <span className="bg-amber-100 border-b-2 border-amber-400">Berdasarkan hasil analisis Rapor Pendidikan tahun sebelumnya, ditemukan beberapa area yang membutuhkan intervensi strategis.</span> : "Berdasarkan hasil analisis Rapor Pendidikan tahun sebelumnya, ditemukan beberapa area yang membutuhkan intervensi strategis."}
                         RKJM ini disusun untuk memberikan arah yang jelas dalam upaya peningkatan mutu berkelanjutan di lingkungan {settings.school?.name || "satuan pendidikan"}.
                       </p>
                       <p className="font-bold mb-2 mt-6">1.2 Landasan Hukum</p>
                       <ul className="list-decimal pl-5 space-y-1 text-justify">
                         <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.</li>
                         <li>Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan PP SNP.</li>
                         <li>Permendikbudristek Nomor 47 Tahun 2023 tentang Standar Pengelolaan.</li>
                       </ul>
                     </div>
                   )}

                   {["daftar_isi", "bab2", "bab3", "bab4", "bab5", "lampiran"].includes(activePageId) && (
                     <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
                       <FileText className="w-12 h-12 mb-4 opacity-50" />
                       <p>Halaman <strong>{outline.find(o=>o.id === activePageId)?.label}</strong></p>
                       <p className="text-xs mt-2">Dihasilkan oleh Document Rendering Engine</p>
                     </div>
                   )}
                </div>

                {/* Footer Page Number Simulation */}
                <div className="absolute bottom-[15mm] w-full text-center text-slate-400 text-[10pt] font-serif">
                   <p>{activePageId === 'cover' ? '' : activePageId === 'pengesahan' ? 'i' : activePageId === 'daftar_isi' ? 'ii' : '1'}</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === "review" && (
        <Card title="Review & Approval" icon={CheckCircle2} description="Beri catatan dan setujui draf RKJM.">
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
             <CheckCircle2 className="w-10 h-10 mb-4 text-slate-300" />
             <p className="font-bold">Mode Review</p>
             <p className="text-sm">Fitur kolaborasi akan diaktifkan di sini.</p>
           </div>
        </Card>
      )}

      {activeTab === "riwayat" && (
        <Card title="Riwayat Versi Dokumen" icon={History} description="Lacak perubahan yang dilakukan pada RKJM.">
           <div className="space-y-4">
             <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">Versi 1.0 (Draft)</p>
                  <p className="text-sm text-slate-500">Baru Saja • Sistem Otomatis</p>
                </div>
                <Button variant="outline" size="sm">Lihat</Button>
             </div>
           </div>
        </Card>
      )}

      {activeTab === "cetak" && (
        <Card title="Cetak & Ekspor RKJM" icon={Printer} description="Unduh dokumen dalam berbagai format.">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-colors bg-white">
               <FileText className="w-10 h-10 text-rose-500 mb-4" />
               <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor PDF (.pdf)</h3>
               <p className="text-sm text-slate-500 mb-6">Format terbaik untuk pencetakan dan publikasi resmi dengan layout tetap.</p>
               <Button onClick={() => window.print()} className="w-full bg-rose-600 hover:bg-rose-700 text-white">Unduh PDF</Button>
             </div>
             <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-colors bg-white">
               <File className="w-10 h-10 text-blue-500 mb-4" />
               <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor Word (.docx)</h3>
               <p className="text-sm text-slate-500 mb-6">Format yang dapat diedit lebih lanjut di Microsoft Word.</p>
               <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">Unduh Word</Button>
             </div>
           </div>
        </Card>
      )}
    </div>
  );
};`;

lines.splice(startIndex, endIndex - startIndex + 1, replacement);
fs.writeFileSync("src/Tampuyak.tsx", lines.join("\\n"));
console.log("Done");
