const fs = require('fs');

const comp = `const DocumentWorkspaceView = ({ docId, navigateToView }: any) => {
  const { settings, updateSetting, getActiveAcademicYear } = useApp();
  const [activeTab, setActiveTab] = useState("pratinjau");
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [printValidation, setPrintValidation] = useState<any[] | null>(null);

  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState("preview"); // preview, edit
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Tersimpan");
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleTimeString());
  const [activeChapter, setActiveChapter] = useState("cover");
  const [showHealth, setShowHealth] = useState(false);
  
  // Editor State for narratives
  const [narratives, setNarratives] = useState(settings.narratives?.[docId] || {});

  const handleNarrativeChange = (chapter: string, text: string) => {
    setAutoSaveStatus("Menyimpan...");
    const newNarratives = { ...narratives, [chapter]: text };
    setNarratives(newNarratives);
    setTimeout(() => {
      // In real app, we update settings
      const currentNarratives = settings.narratives || {};
      updateSetting("narratives", "", { ...currentNarratives, [docId]: newNarratives });
      setAutoSaveStatus("Tersimpan");
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000);
  };

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
  
  const healthChecks = [
    { id: "govLogo", label: "Logo Pemerintah Daerah", valid: !!settings.identityAssets?.governmentLogo?.url },
    { id: "schoolId", label: "Identitas Sekolah", valid: !!settings.school?.name && !!settings.school?.npsn },
    { id: "signatures", label: "Tanda Tangan Pengesah", valid: !!settings.identityAssets?.principalSignature?.url && !!settings.identityAssets?.committeeSignature?.url },
    { id: "stamp", label: "Stempel Sekolah", valid: !!settings.identityAssets?.stamp?.url },
    { id: "chapters", label: "Kelengkapan Bab", valid: true },
    { id: "printReady", label: "Print Ready", valid: ["Disetujui", "Terkunci", "Siap Dicetak", "Final"].includes(meta.status) }
  ];
  
  const healthScore = Math.round((healthChecks.filter(c => c.valid).length / healthChecks.length) * 100);
  const isPrintReady = healthScore === 100;

  const handleExportDocx = () => {
    if (!isPrintReady) return showToast("Dokumen belum siap dicetak. Periksa Health Score.", "error");
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + document.getElementById("printable-doc").innerHTML + footer;
    const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = \`\${meta.title} - \${settings.school?.name || "Sekolah"}.doc\`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };
  
  const handlePrint = () => {
     if (!isPrintReady) return showToast("Dokumen belum siap dicetak. Periksa Health Score.", "error");
     setTimeout(() => window.print(), 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const chapterList = [
    { id: "cover", label: "Halaman Sampul" },
    { id: "approval", label: "Lembar Pengesahan" },
    { id: "toc", label: "Daftar Isi" },
    { id: "bab1", label: "BAB I: Pendahuluan" },
    { id: "bab2", label: "BAB II: Analisis Kondisi" },
    { id: "bab3", label: "BAB III: Program Kerja" },
    { id: "bab4", label: "BAB IV: Rencana Anggaran" },
    { id: "bab5", label: "BAB V: Penutup" },
    { id: "appendix", label: "Lampiran" },
  ];

  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    const el = document.getElementById(\`chapter-\${id}\`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  
  // Custom Rich Text Editor component for narratives
  const NarrativeEditor = ({ id, label, defaultText, readOnly }: any) => {
    const text = narratives[id] || defaultText;
    return (
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-2 text-slate-800">{label}</h4>
        {!readOnly && mode === "edit" ? (
          <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all bg-white">
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Bold className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Italic className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><Underline className="w-4 h-4" /></button>
               <div className="w-px h-6 bg-slate-300 mx-1"></div>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><AlignLeft className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><AlignCenter className="w-4 h-4" /></button>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><AlignRight className="w-4 h-4" /></button>
               <div className="w-px h-6 bg-slate-300 mx-1"></div>
               <button className="p-1.5 hover:bg-slate-200 rounded text-slate-700"><List className="w-4 h-4" /></button>
            </div>
            <textarea 
              className="w-full min-h-[120px] p-4 outline-none resize-y text-slate-800"
              value={text}
              onChange={(e) => handleNarrativeChange(id, e.target.value)}
            />
          </div>
        ) : (
          <p className="text-justify leading-relaxed indent-8 text-slate-800 whitespace-pre-wrap">{text}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6 -mx-6 bg-slate-100">
      {/* ENTERPRISE DOCUMENT TOOLBAR */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-2 hover:bg-slate-100" onClick={() => navigateToView(meta.prev?.id || "beranda")}>
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 text-lg uppercase">{meta.title}</span>
              <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase \${meta.status === 'Draft' ? 'bg-amber-100 text-amber-800' : meta.status === 'Review' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}\`}>
                {meta.status}
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <span className="flex items-center"><RefreshCcw className="w-3 h-3 mr-1" /> {autoSaveStatus} {lastSaved}</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-indigo-600 underline" onClick={() => setActiveTab("riwayat")}>Riwayat Versi</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative group mr-2">
            <Button variant="outline" className={\`h-9 gap-2 font-bold \${healthScore === 100 ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'}\`} onClick={() => setShowHealth(!showHealth)}>
              <ShieldCheck className="w-4 h-4" /> Score: {healthScore}%
            </Button>
            {showHealth && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Pre-Print Certification</h4>
                <div className="space-y-2">
                  {healthChecks.map(c => (
                    <div key={c.id} className="flex items-center justify-between text-sm">
                      <span className={c.valid ? "text-slate-700" : "text-rose-600 font-medium"}>{c.label}</span>
                      {c.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          
          <Button variant="ghost" className={\`w-9 h-9 p-0 \${mode === 'edit' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}\`} onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')} title="Edit Mode">
            <Edit3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="w-9 h-9 p-0 text-slate-600 hover:bg-slate-100" onClick={handlePrint} title="Cetak/PDF" disabled={!isPrintReady}>
            <Printer className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="w-9 h-9 p-0 text-slate-600 hover:bg-slate-100" onClick={handleExportDocx} title="Ekspor DOCX" disabled={!isPrintReady}>
            <Download className="w-5 h-5" />
          </Button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <div className="flex items-center bg-slate-100 rounded-lg px-2 py-1 mr-2">
            <Button variant="ghost" className="w-7 h-7 p-0 text-slate-600 hover:bg-slate-200" onClick={() => setZoom(Math.max(50, zoom - 25))}><ZoomOut className="w-4 h-4" /></Button>
            <span className="text-xs font-bold text-slate-700 w-12 text-center">{zoom}%</span>
            <Button variant="ghost" className="w-7 h-7 p-0 text-slate-600 hover:bg-slate-200" onClick={() => setZoom(Math.min(200, zoom + 25))}><ZoomIn className="w-4 h-4" /></Button>
          </div>

          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
             <input type="text" placeholder="Cari..." className="pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-sm w-40 focus:ring-2 focus:ring-indigo-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <Button variant="ghost" className="w-9 h-9 p-0 text-slate-600 hover:bg-slate-100 ml-2" onClick={toggleFullscreen} title="Fullscreen">
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT NAVIGATION */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 z-10">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-black text-xs text-slate-400 uppercase tracking-wider">Navigasi Dokumen</h3>
          </div>
          <div className="p-2 space-y-1">
            {chapterList.map(ch => (
              <button 
                key={ch.id} 
                onClick={() => scrollToChapter(ch.id)}
                className={\`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeChapter === ch.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}\`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN WORKSPACE - PAGE VIEW */}
        <div className={\`flex-1 overflow-y-auto \${isDarkPreview ? 'bg-slate-800' : 'bg-slate-100'}\`} style={{ padding: '2rem 0' }}>
          <div 
            className="flex flex-col items-center gap-8 transition-transform origin-top" 
            style={{ transform: \`scale(\${zoom / 100})\` }}
          >
            <div id="printable-doc" className="w-[210mm] min-h-[297mm] bg-white shadow-xl ring-1 ring-slate-900/5 print:shadow-none p-[2.5cm] font-serif text-black relative flex flex-col">
              
              {/* Cover Page */}
              <div id="chapter-cover" className="flex-1 flex flex-col items-center justify-center text-center relative min-h-[200mm]">
                {settings.identityAssets?.governmentLogo?.url && (
                   <img src={settings.identityAssets.governmentLogo.url} className="w-32 h-32 object-contain mb-12" alt="Logo" />
                )}
                {settings.identityAssets?.schoolPhoto?.url && (
                   <img src={settings.identityAssets.schoolPhoto.url} className="w-3/4 max-w-lg h-48 object-cover rounded-xl shadow-md mb-12" alt="School" />
                )}
                <h1 className="text-4xl font-bold mb-4 uppercase">{meta.subtitle}</h1>
                <h2 className="text-3xl font-bold mb-12 uppercase">({meta.title})</h2>
                <h3 className="text-2xl mb-12">Tahun {getActiveAcademicYear()}</h3>
                <div className="mt-auto text-xl font-bold uppercase pb-12">
                  <p>{settings.school?.name || "NAMA SEKOLAH"}</p>
                  <p>NPSN: {settings.school?.npsn || "NPSN"}</p>
                </div>
              </div>

              {/* Approval Page */}
              <div id="chapter-approval" className="page-break-before mt-32 pt-10 min-h-[200mm]" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-16 uppercase">LEMBAR PENGESAHAN</h3>
                 <p className="text-justify mb-16 leading-relaxed text-lg">
                   Dokumen {meta.title} ini telah disahkan dan disetujui untuk digunakan sebagai pedoman penyelenggaraan pendidikan di {settings.school?.name || "sekolah"} pada tahun ajaran {getActiveAcademicYear()}.
                 </p>
                 <div className="grid grid-cols-2 gap-8 text-center mt-24">
                   <div className="relative inline-block text-left">
                     <p className="mb-12">Mengesahkan,<br/>Kepala Sekolah</p>
                     <div className="h-24 relative flex items-center justify-center">
                        {settings.identityAssets?.principalSignature?.url && <img src={settings.identityAssets.principalSignature.url} className="h-24 object-contain z-10 relative" alt="ttd" />}
                        {settings.identityAssets?.stamp?.url && <img src={settings.identityAssets.stamp.url} className="h-24 opacity-80 object-contain absolute left-0 top-0 -translate-x-4 -translate-y-2 mix-blend-multiply" alt="stempel" />}
                     </div>
                     <p className="font-bold underline mt-4 relative z-20">{settings.master?.principal?.name || "Nama Kepala Sekolah"}</p>
                     <p>NIP. {settings.master?.principal?.nip || "-"}</p>
                   </div>
                   <div className="relative inline-block text-left">
                     <p className="mb-12">Menyetujui,<br/>Ketua Komite</p>
                     <div className="h-24 relative flex items-center justify-center">
                        {settings.identityAssets?.committeeSignature?.url && <img src={settings.identityAssets.committeeSignature.url} className="h-24 object-contain z-10 relative" alt="ttd" />}
                     </div>
                     <p className="font-bold underline mt-4">{settings.master?.committee?.name || "Nama Ketua Komite"}</p>
                   </div>
                 </div>
              </div>

              {/* TOC */}
              <div id="chapter-toc" className="page-break-before mt-32 pt-10 min-h-[200mm]" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-12 uppercase">Daftar Isi</h3>
                 <div className="space-y-4 max-w-2xl mx-auto text-lg">
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>LEMBAR PENGESAHAN</span><span>i</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1"><span>DAFTAR ISI</span><span>ii</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-6"><span>BAB I: PENDAHULUAN</span><span>1</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-6"><span>BAB II: ANALISIS KONDISI</span><span>4</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-6"><span>BAB III: PROGRAM KERJA</span><span>8</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-6"><span>BAB IV: RENCANA ANGGARAN</span><span>15</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-6"><span>BAB V: PENUTUP</span><span>20</span></div>
                   <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 font-bold mt-6"><span>LAMPIRAN</span><span>21</span></div>
                 </div>
              </div>

              {/* Chapters - HYBRID EDITOR */}
              <div id="chapter-bab1" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB I<br/>PENDAHULUAN</h3>
                 <NarrativeEditor 
                   id="bab1_latar" 
                   label="1.1 Latar Belakang" 
                   defaultText={\`Pendidikan merupakan fondasi utama dalam pembangunan karakter dan kompetensi peserta didik. \${settings.school?.name || "Sekolah ini"} berkomitmen untuk terus meningkatkan mutu layanan pendidikan melalui perencanaan yang terstruktur dan terukur.\`} 
                 />
                 <NarrativeEditor 
                   id="bab1_tujuan" 
                   label="1.2 Tujuan dan Sasaran" 
                   defaultText={\`Tujuan utama penyusunan dokumen ini adalah untuk memberikan pedoman arah kebijakan dan operasional sekolah selama periode yang telah ditetapkan, guna memastikan seluruh sumber daya dimanfaatkan secara optimal.\`} 
                 />
              </div>

              <div id="chapter-bab2" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB II<br/>ANALISIS KONDISI</h3>
                 <NarrativeEditor 
                   id="bab2_kondisi" 
                   label="2.1 Evaluasi Rapor Pendidikan" 
                   defaultText={\`Berdasarkan hasil Rapor Pendidikan dan evaluasi internal, terdapat beberapa area yang menjadi fokus peningkatan, terutama pada literasi, numerasi, dan iklim keamanan sekolah.\`} 
                 />
                 
                 {/* Protected Section Example */}
                 <div className="mt-8 bg-slate-50 border border-slate-200 p-4 rounded print:bg-white print:border-none print:p-0">
                    <p className="text-sm text-amber-600 font-bold mb-2 print:hidden flex items-center"><Lock className="w-4 h-4 mr-1"/> Bagian ini dikunci (Data Otomatis dari Rapor Pendidikan)</p>
                    <table className="w-full border-collapse border border-slate-800 text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-800 p-2 text-left">Indikator</th>
                          <th className="border border-slate-800 p-2 text-center">Nilai</th>
                          <th className="border border-slate-800 p-2 text-left">Capaian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.rapor?.indicators?.slice(0,3).map((ind: any, i: number) => (
                          <tr key={i}>
                            <td className="border border-slate-800 p-2">{ind.name}</td>
                            <td className="border border-slate-800 p-2 text-center">{ind.score}</td>
                            <td className="border border-slate-800 p-2">{ind.achievement}</td>
                          </tr>
                        )) || (
                          <tr><td colSpan={3} className="border border-slate-800 p-2 text-center text-slate-500">Data rapor belum disinkronisasi</td></tr>
                        )}
                      </tbody>
                    </table>
                 </div>
              </div>

              <div id="chapter-bab3" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB III<br/>PROGRAM KERJA</h3>
                 <NarrativeEditor 
                   id="bab3_strategi" 
                   label="3.1 Strategi Pelaksanaan" 
                   defaultText={\`Program kerja disusun berdasarkan skala prioritas yang ditetapkan dari hasil analisis kesenjangan mutu. Seluruh program berorientasi pada pencapaian Standar Nasional Pendidikan (SNP).\`} 
                 />
                 
                 {/* Protected Section Example */}
                 <div className="mt-8 bg-slate-50 border border-slate-200 p-4 rounded print:bg-white print:border-none print:p-0">
                    <p className="text-sm text-amber-600 font-bold mb-2 print:hidden flex items-center"><Lock className="w-4 h-4 mr-1"/> Bagian ini dikunci (Data Otomatis dari Perencanaan)</p>
                    <table className="w-full border-collapse border border-slate-800 text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-800 p-2">Program / Kegiatan</th>
                          <th className="border border-slate-800 p-2">Tujuan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.planning?.rkt?.programs?.slice(0,4).map((p: any, i: number) => (
                          <tr key={i}>
                            <td className="border border-slate-800 p-2">{p.name}</td>
                            <td className="border border-slate-800 p-2">{p.objective}</td>
                          </tr>
                        )) || (
                          <tr><td colSpan={2} className="border border-slate-800 p-2 text-center text-slate-500">Data program belum disusun</td></tr>
                        )}
                      </tbody>
                    </table>
                 </div>
              </div>

              <div id="chapter-bab4" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB IV<br/>RENCANA ANGGARAN</h3>
                 <NarrativeEditor 
                   id="bab4_anggaran" 
                   label="4.1 Kebijakan Anggaran" 
                   defaultText={\`Seluruh rencana anggaran telah diselaraskan dengan kebutuhan program prioritas dan diinput melalui sistem ARKAS. Rincian anggaran mencakup belanja pegawai, belanja barang dan jasa, serta belanja modal.\`} 
                 />
              </div>

              <div id="chapter-bab5" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">BAB V<br/>PENUTUP</h3>
                 <NarrativeEditor 
                   id="bab5_penutup" 
                   label="5.1 Kesimpulan" 
                   defaultText={\`Dokumen \${meta.title} ini diharapkan dapat menjadi panduan yang efektif bagi seluruh pemangku kepentingan dalam mewujudkan visi, misi, dan tujuan \${settings.school?.name || "Sekolah"}.\`} 
                 />
              </div>

              {/* Appendix */}
              <div id="chapter-appendix" className="page-break-before mt-32 pt-10" style={{ pageBreakBefore: "always" }}>
                 <h3 className="text-2xl font-bold text-center mb-8 uppercase">LAMPIRAN</h3>
                 <ul className="list-disc pl-8 space-y-4 text-lg">
                   <li>SK Tim Pengembang Sekolah</li>
                   <li>Dokumentasi Rapat Penyusunan</li>
                   <li>Berita Acara Pengesahan</li>
                   <li>Rapor Pendidikan Tahun Berjalan</li>
                 </ul>
              </div>
              
              <div className="hidden print:block fixed bottom-4 left-0 w-full text-center">
                 <p className="text-[10px] text-slate-500 font-sans font-medium">Dihasilkan oleh TAMPUYAK OS (School Operating System) v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('workspace_comp.txt', comp);
console.log("Written workspace_comp.txt");
