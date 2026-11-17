import fs from 'fs';

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');
const startIndex = lines.findIndex(l => l.includes('const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {'));
let endIndex = -1;
let openBrackets = 0;
let started = false;

for (let i = startIndex; i < lines.length; i++) {
  openBrackets += (lines[i].match(/\{/g) || []).length;
  openBrackets -= (lines[i].match(/\}/g) || []).length;
  if (openBrackets > 0) started = true;
  if (started && openBrackets === 0) {
    endIndex = i;
    break;
  }
}

const documentWorkspaceCode = `const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState("pratinjau");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  const docs = settings?.documents || [];
  
  const getDocMeta = (typeId: string) => {
    const d = docs.find((x: any) => x.type === typeId.toUpperCase());
    if (d) {
      return {
        title: d.type,
        status: d.status || "Draft",
        version: d.version || "1.0",
        approval: ["Disetujui", "Terkunci", "Diarsipkan"].includes(d.status) ? "Telah Disetujui" : "Belum Disetujui",
        lastRevision: "Tadi",
      };
    }
    return {
      title: typeId.toUpperCase(),
      status: "Belum Dibuat",
      version: "-",
      approval: "-",
      lastRevision: "-",
    };
  };

  const docMetadata: any = {
    rkjm: {
      ...getDocMeta("rkjm"),
      subtitle: "Rencana Kerja Jangka Menengah",
      related: ["RKT", "RKAS"],
      owner: "Tim Pengembang Sekolah",
      reviewer: "Kepala Sekolah, Komite",
      prev: { id: "diagnosis", label: "Analisis Prioritas" },
      next: { id: "documentDetail_rkt", label: "RKT" }
    },
    rkt: {
      ...getDocMeta("rkt"),
      subtitle: "Rencana Kerja Tahunan",
      related: ["RKJM", "RKAS"],
      owner: "Tim Pengembang Sekolah",
      reviewer: "Kepala Sekolah",
      prev: { id: "documentDetail_rkjm", label: "RKJM" },
      next: { id: "documentDetail_rkas", label: "RKAS" }
    },
    rkas: {
      ...getDocMeta("rkas"),
      subtitle: "Rencana Kegiatan dan Anggaran",
      related: ["RKT"],
      owner: "Bendahara BOS",
      reviewer: "Kepala Sekolah",
      prev: { id: "documentDetail_rkt", label: "RKT" },
      next: { id: "monitoring", label: "Monitoring" }
    },
    ksp: {
      ...getDocMeta("ksp"),
      subtitle: "Kurikulum Satuan Pendidikan",
      related: ["RKJM"],
      owner: "Tim Kurikulum",
      reviewer: "Pengawas Sekolah",
      prev: { id: "documentDetail_rkjm", label: "RKJM" },
      next: null
    }
  };

  const meta = docMetadata[docId] || docMetadata.rkjm;
  
  const getNextAction = () => {
    if (meta.status === "Belum Dibuat" || meta.status === "Draft" || meta.status === "Perlu Revisi") {
      return {
        desc: \`Lanjutkan penyusunan \${meta.title} agar dapat segera direview.\`,
        label: \`Susun \${meta.title}\`,
        action: () => navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline")
      };
    } else if (meta.status === "Review") {
      return {
        desc: \`Tinjau catatan dari \${meta.reviewer} dan lakukan perbaikan yang diperlukan.\`,
        label: "Lihat Catatan Review",
        action: () => setActiveTab("review")
      };
    } else if (meta.status === "Disetujui" || meta.status === "Terkunci") {
      if (meta.next) {
         return {
           desc: \`\${meta.title} telah selesai. Langkah berikutnya adalah menyusun \${meta.next.label}.\`,
           label: \`Buka \${meta.next.label}\`,
           action: () => navigateToView(meta.next.id)
         }
      } else {
         return {
           desc: \`\${meta.title} telah selesai. Cetak dokumen ini untuk diarsipkan.\`,
           label: "Cetak Dokumen",
           action: () => setActiveTab("cetak")
         }
      }
    }
    return null;
  };
  
  const nextAction = getNextAction();

  const tabs = [
    { id: "pratinjau", label: "Preview", icon: FileText },
    { id: "review", label: "Review", icon: CheckCircle2 },
    { id: "bandingkan", label: "Bandingkan Versi", icon: GitCompare },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "cetak", label: "Cetak & Ekspor", icon: Printer },
    { id: "arsipkan", label: "Arsipkan", icon: Archive },
  ];

  if (isPrintMode) {
    return (
      <div className="bg-white min-h-screen font-serif text-black p-8">
        <div id="printable-doc" className="max-w-[210mm] mx-auto space-y-24">
          <div className="text-center pt-24 pb-32">
            <h1 className="text-4xl font-bold mb-4 uppercase">{meta.subtitle} ({meta.title})</h1>
            <h2 className="text-2xl mb-12">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</h2>
            <div className="mt-32 text-xl font-bold">
              <p>{settings.school?.name || "Nama Sekolah"}</p>
              <p>NPSN: {settings.school?.npsn || "-"}</p>
            </div>
          </div>
          <div className="page-break-before" style={{ pageBreakBefore: 'always' }}>
             <h3 className="text-2xl font-bold text-center mb-12">LEMBAR PENGESAHAN</h3>
             <p className="text-justify mb-12 leading-relaxed">Dokumen {meta.title} ini telah direview, disetujui dan disahkan.</p>
             <div className="grid grid-cols-2 gap-8 text-center mt-16">
               <div>
                 <p className="mb-24">Mengesahkan,<br/>Kepala Sekolah</p>
                 <p className="font-bold underline">{settings.principal?.name || "Belum diatur"}</p>
                 <p>NIP. {settings.principal?.nip || "-"}</p>
               </div>
             </div>
          </div>
        </div>
        <div className="fixed top-4 right-4 print:hidden">
          <Button onClick={() => setIsPrintMode(false)} variant="outline" className="bg-white">Kembali</Button>
        </div>
        <style>{\`
          @media print {
            body * { visibility: hidden; }
            .print\\\\:hidden { display: none !important; }
            #printable-doc { position: absolute; left: 0; top: 0; width: 100%; max-width: none; }
            #printable-doc, #printable-doc * { visibility: visible; }
          }
        \`}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Quick Navigation */}
      <div className="flex items-center justify-between text-sm font-bold">
         {meta.prev ? (
           <span className="cursor-pointer text-slate-500 hover:text-indigo-600 flex items-center transition-colors" onClick={() => navigateToView(meta.prev.id)}>
             <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke {meta.prev.label}
           </span>
         ) : <div/>}
         <span className="text-slate-400">Sedang membuka {meta.title}</span>
         {meta.next ? (
           <span className="cursor-pointer text-slate-500 hover:text-indigo-600 flex items-center transition-colors" onClick={() => navigateToView(meta.next.id)}>
             Lanjut ke {meta.next.label} <ChevronRight className="w-4 h-4 ml-1" />
           </span>
         ) : <div/>}
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-1 flex items-center">
              {meta.title}
              <div className={\`ml-4 px-3 py-1 text-xs font-bold rounded-full border \${meta.status === "Draft" || meta.status === "Belum Dibuat" ? "bg-amber-100 text-amber-700 border-amber-200" : meta.status === "Review" ? "bg-blue-100 text-blue-700 border-blue-200" : ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status) ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"} uppercase\`}>
                {meta.status}
              </div>
            </h1>
            <p className="text-slate-500 font-medium">{meta.subtitle}</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0 text-right">
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Versi</p>
               <p className="text-sm font-bold text-slate-700">{meta.version}</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Tahun</p>
               <p className="text-sm font-bold text-slate-700">{settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Terakhir Diubah</p>
               <p className="text-sm font-bold text-slate-700">{meta.lastRevision}</p>
            </div>
          </div>
        </div>

        {/* Primary Tabs (Action Bar) */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-100 pb-0 no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={\`flex items-center px-5 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap \${activeTab === t.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}\`}
            >
              <t.icon className={\`w-4 h-4 mr-2 \${activeTab === t.id ? 'text-indigo-600' : 'text-slate-400'}\`} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-9 space-y-6">
          {activeTab === "pratinjau" && (
            <>
              {nextAction && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-indigo-900 flex items-center"><Zap className="w-4 h-4 mr-2 text-amber-500" /> Langkah Berikutnya</h3>
                    <p className="text-sm text-indigo-700 mt-1">{nextAction.desc}</p>
                  </div>
                  <Button onClick={nextAction.action} className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap w-full sm:w-auto">
                    {nextAction.label}
                  </Button>
                </div>
              )}
              
              <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm min-h-[600px]">
                <div className="max-w-[210mm] mx-auto space-y-12">
                   <div className="text-center pt-12 pb-16 border-b border-slate-200">
                      <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4 uppercase">{meta.subtitle}</h2>
                      <p className="text-slate-500 font-medium">Tahun {settings.academicYears?.find((y:any) => y.isActive)?.name || "2024/2025"}</p>
                   </div>
                   {meta.status === "Belum Dibuat" ? (
                     <div className="text-center py-20">
                       <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                       <p className="text-slate-500 mb-6 font-medium">Dokumen ini belum dibuat.</p>
                       <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline")}>Mulai Penyusunan {meta.title}</Button>
                     </div>
                   ) : (
                     <div className="text-center py-20">
                       <FileText className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
                       <p className="text-slate-500 mb-6 font-medium">Pratinjau {meta.title} ditampilkan di sini.</p>
                       {["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status) && (
                         <Button variant="outline" className="text-indigo-600 border-indigo-200" onClick={() => setShowImpactAnalysis(true)}>Buat Revisi Baru</Button>
                       )}
                     </div>
                   )}
                </div>
              </div>
            </>
          )}

          {activeTab === "review" && (
            <Card title="Review Dokumen" icon={CheckCircle2} description="Sesi pemeriksaan dan pemberian catatan oleh tim reviewer.">
               {meta.status === "Review" ? (
                 <div className="space-y-4">
                   <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                     <p className="font-bold text-amber-800 mb-1">Catatan {meta.reviewer}</p>
                     <p className="text-sm text-amber-700">Tolong pastikan program prioritas dialokasikan dengan tepat.</p>
                     <p className="text-xs text-amber-600 mt-2">Hari ini</p>
                   </div>
                   <Button onClick={() => navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline")} className="w-full bg-indigo-600">Perbaiki {meta.title}</Button>
                 </div>
               ) : (
                 <div className="text-center py-12">
                   <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <p className="text-slate-500 font-medium">Tidak ada review aktif.</p>
                 </div>
               )}
            </Card>
          )}

          {activeTab === "bandingkan" && (
            <Card title="Bandingkan Versi" icon={GitCompare} description="Lihat perbedaan antar versi dokumen.">
               <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
                 <GitCompare className="w-10 h-10 mb-4 text-slate-300" />
                 <p className="font-bold">Mode Perbandingan</p>
                 <p className="text-sm">Fitur perbandingan revisi akan aktif setelah ada lebih dari satu versi.</p>
               </div>
            </Card>
          )}

          {activeTab === "riwayat" && (
            <Card title="Riwayat Aktivitas Dokumen" icon={History} description="Lacak semua perubahan dan persetujuan.">
               {meta.status !== "Belum Dibuat" ? (
                 <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-4 mt-4">
                   <div className="relative">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[23px] top-1.5 ring-4 ring-white"></div>
                      <p className="text-sm font-bold text-slate-800">Status berubah menjadi {meta.status}</p>
                      <p className="text-xs text-slate-500 mt-1">Hari ini • Versi {meta.version}</p>
                   </div>
                   <div className="relative">
                      <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[23px] top-1.5 ring-4 ring-white"></div>
                      <p className="text-sm font-bold text-slate-800">{meta.title} Dibuat</p>
                      <p className="text-xs text-slate-500 mt-1">Oleh {meta.owner}</p>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-12 text-slate-500 italic">Belum ada riwayat.</div>
               )}
            </Card>
          )}

          {activeTab === "cetak" && (
            <div className="space-y-6">
              <Card title="Cetak & Ekspor" icon={Printer} description="Pilih format untuk mengunduh dokumen resmi.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 bg-white">
                     <FileText className="w-10 h-10 text-rose-500 mb-4" />
                     <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor PDF (.pdf)</h3>
                     <p className="text-sm text-slate-500 mb-6">Format terbaik untuk pencetakan resmi.</p>
                     <Button onClick={() => { setIsPrintMode(true); setTimeout(() => window.print(), 500); }} className="w-full bg-rose-600 hover:bg-rose-700 text-white" disabled={meta.status === "Belum Dibuat"}>Unduh PDF</Button>
                   </div>
                   <div className="border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 bg-white">
                     <FileText className="w-10 h-10 text-blue-500 mb-4" />
                     <h3 className="font-bold text-slate-800 text-lg mb-2">Ekspor Word (.docx)</h3>
                     <p className="text-sm text-slate-500 mb-6">Format yang dapat diedit lebih lanjut.</p>
                     <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" disabled={meta.status === "Belum Dibuat"}>Unduh Word</Button>
                   </div>
                 </div>
              </Card>
              <Card title="Riwayat Pencetakan" icon={History} description="Log pencetakan dan ekspor dokumen.">
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500">
                       <tr>
                         <th className="px-4 py-3 font-bold rounded-tl-xl">Tanggal</th>
                         <th className="px-4 py-3 font-bold">Dicetak Oleh</th>
                         <th className="px-4 py-3 font-bold">Versi</th>
                         <th className="px-4 py-3 font-bold rounded-tr-xl">Format</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {/* Real app would map history, this is placeholder structure */}
                       <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">Belum ada riwayat pencetakan.</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
              </Card>
            </div>
          )}

          {activeTab === "arsipkan" && (
            <Card title="Arsipkan Dokumen" icon={Archive} description="Simpan dokumen ke dalam arsip sekolah.">
               <div className="p-6 border-2 border-slate-200 rounded-2xl">
                 <h3 className="font-bold text-slate-800 text-lg mb-2">Kunci dan Arsipkan</h3>
                 <p className="text-sm text-slate-500 mb-6">Dokumen yang diarsipkan tidak dapat diubah lagi dan akan menjadi rekaman permanen. Anda dapat mencarinya di menu Arsip.</p>
                 <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" disabled={!["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status)}>Arsipkan {meta.title}</Button>
               </div>
            </Card>
          )}
        </div>

        {/* Right Information Panel */}
        <div className="xl:col-span-3 space-y-4 sticky top-28">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-bold text-slate-700 mb-4 px-2">Informasi Dokumen</h3>
            <div className="space-y-3 px-2 text-sm">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Status</p>
                <p className={\`font-medium \${["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status) ? "text-emerald-600" : meta.status === "Review" ? "text-blue-600" : meta.status === "Belum Dibuat" ? "text-slate-500" : "text-amber-600"}\`}>{meta.status}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Versi</p>
                <p className="font-medium text-slate-700">{meta.version}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Persetujuan</p>
                <p className="font-medium text-slate-700">{meta.approval}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Revisi Terakhir</p>
                <p className="font-medium text-slate-700">{meta.lastRevision}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Pemilik Dokumen</p>
                <p className="font-medium text-slate-700">{meta.owner}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Dokumen Terkait</p>
                <div className="flex flex-wrap gap-2">
                  {meta.related.map((r: string) => (
                    <span key={r} onClick={() => navigateToView("documentDetail_" + r.toLowerCase())} className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-md font-bold transition-colors">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
             <h3 className="font-bold text-slate-700 mb-3 px-2">Alur Dokumen</h3>
             <div className="px-2 space-y-2">
                <div className={\`p-2 rounded-lg text-xs font-bold flex items-center justify-center \${docId === "rkjm" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-slate-50 text-slate-400 cursor-pointer hover:bg-slate-100 border border-slate-100"}\`} onClick={() => docId !== "rkjm" && navigateToView("documentDetail_rkjm")}>RKJM</div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-300" /></div>
                <div className={\`p-2 rounded-lg text-xs font-bold flex items-center justify-center \${docId === "rkt" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-slate-50 text-slate-400 cursor-pointer hover:bg-slate-100 border border-slate-100"}\`} onClick={() => docId !== "rkt" && navigateToView("documentDetail_rkt")}>RKT</div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-300" /></div>
                <div className={\`p-2 rounded-lg text-xs font-bold flex items-center justify-center \${docId === "rkas" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-slate-50 text-slate-400 cursor-pointer hover:bg-slate-100 border border-slate-100"}\`} onClick={() => docId !== "rkas" && navigateToView("documentDetail_rkas")}>RKAS</div>
             </div>
          </div>
        </div>
      </div>

      {showImpactAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Buat Revisi Baru?</h2>
              <p className="text-slate-600 mb-6 font-medium">Dokumen ini telah disetujui. Untuk mengubahnya, Anda harus membuat revisi baru (v{(parseFloat(meta.version) || 1.0) + 0.1}).</p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <p className="text-sm font-bold text-amber-800 mb-3">Perubahan ini akan memengaruhi:</p>
                <div className="space-y-2">
                  {meta.related.map((r: string) => (
                    <div key={r} className="flex items-center text-sm text-amber-700">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Status sinkronisasi {r}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowImpactAnalysis(false)}>Batal</Button>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => {
                  setShowImpactAnalysis(false);
                  navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline");
                }}>Lanjutkan Revisi</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`;

lines.splice(startIndex, endIndex - startIndex + 1, documentWorkspaceCode);
fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
