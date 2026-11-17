const KSPStudioView = ({ navigateToView }: any) => {
  const { settings, getActiveAcademicYear } = useApp();
  const { state: workspaceState, setMode: setWorkspaceMode } = useWorkspace();
  const [activeTab, setActiveTab] = useState<"dashboard" | "workspace">("dashboard");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"pratinjau" | "lampiran" | "validasi">("pratinjau");
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Smart Attachments
  const attachments = [
    { name: 'Kalender Pendidikan', status: 'Missing' },
    { name: 'SK Tim Pengembang Kurikulum', status: 'Missing' },
    { name: 'SK Penetapan Kurikulum', status: 'Missing' },
    { name: 'Jadwal Pelajaran', status: 'Missing' },
    { name: 'Berita Acara', status: 'Missing' },
    { name: 'Dokumen Pendukung', status: 'Missing' },
  ];

  // Validation Dummy
  const validations = [
    { type: 'Missing Attachment', message: 'Kalender Pendidikan belum diunggah', status: 'warning' },
    { type: 'Missing Chapter', message: 'Visi Misi Tujuan masih kosong', status: 'error' },
    { type: 'Incomplete Section', message: 'Karakteristik Satuan Pendidikan belum divalidasi', status: 'error' },
    { type: 'Pending Review', message: 'Draft KSP memerlukan reviu Kepala Sekolah', status: 'warning' },
  ];

  // Dummy DocumentModel for KSP
  const dummyDocument = {
    cover: { id: 'c1', title: 'Cover', subtitle: '', sections: [] },
    approval: { id: 'c2', title: 'Lembar Pengesahan', subtitle: '', sections: [] },
    toc: { id: 'c3', title: 'Daftar Isi', subtitle: '', sections: [] },
    chapter1: { id: 'bab1', title: 'BAB I', subtitle: 'Karakteristik Satuan Pendidikan', sections: [{ id: 's1', title: '', paragraphs: ['Knowledge Builder will generate this section.'] }] },
    chapter2: { id: 'bab2', title: 'BAB II', subtitle: 'Visi, Misi, dan Tujuan', sections: [{ id: 's2', title: '', paragraphs: ['Knowledge Builder will generate this section.'] }] },
    chapter3: { id: 'bab3', title: 'BAB III', subtitle: 'Pengorganisasian Pembelajaran', sections: [{ id: 's3', title: '', paragraphs: ['Knowledge Builder will generate this section.'] }] },
    chapter4: { id: 'bab4', title: 'BAB IV', subtitle: 'Perencanaan Pembelajaran', sections: [{ id: 's4', title: '', paragraphs: ['Knowledge Builder will generate this section.'] }] },
    chapter5: { id: 'bab5', title: 'BAB V', subtitle: 'Evaluasi dan Pengembangan', sections: [{ id: 's5', title: '', paragraphs: ['Knowledge Builder will generate this section.'] }] },
    appendix: { id: 'bab6', title: 'BAB VI', subtitle: 'Lampiran', sections: [{ id: 's6', title: '', paragraphs: ['Knowledge Builder will generate this section.'] }] },
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white border-t-4 border-indigo-800 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 p-6 md:p-8 border-x border-b border-[var(--color-eds-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-indigo-700">
            <BookOpen className="w-3.5 h-3.5 mr-2" />Enterprise KSP
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Kurikulum Satuan Pendidikan
          </h1>
          <p className="text-[var(--color-eds-text-secondary)] text-lg max-w-2xl leading-relaxed">
            Pusat penyusunan KSP berstandar enterprise yang mengintegrasikan data karakteristik, rapor pendidikan, visi misi, dan perencanaan pembelajaran secara dinamis.
          </p>
        </div>
        <div className="relative z-10">
          <Button onClick={() => setActiveTab("workspace")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 h-auto shadow-md">
            Buka KSP Workspace <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Karakteristik Satuan Pendidikan", id: "BAB I" },
          { title: "Visi Misi Tujuan", id: "BAB II" },
          { title: "Pengorganisasian Pembelajaran", id: "BAB III" },
          { title: "Perencanaan Pembelajaran", id: "BAB IV" },
          { title: "Evaluasi & Pengembangan", id: "BAB V" },
          { title: "Lampiran", id: "BAB VI" }
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-eds-border)] p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{card.id}</span>
                <span className="px-2 py-1 bg-slate-100 text-[var(--color-eds-text-secondary)] text-xs font-bold uppercase rounded">Pending</span>
              </div>
              <h3 className="font-bold text-lg text-[var(--color-eds-text-primary)] mb-2 group-hover:text-indigo-700 transition-colors">{card.title}</h3>
              <p className="text-sm text-[var(--color-eds-text-secondary)] font-medium">Status: Belum Dihasilkan</p>
              <p className="text-xs text-slate-400 mt-1">Terakhir diperbarui: -</p>
            </div>
            <Button variant="outline" className="w-full mt-6 text-indigo-700 border-indigo-200 hover:bg-indigo-50" onClick={() => setActiveTab("workspace")}>
              Buka Workspace
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkspace = () => (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)]">
      {/* TOOLBAR */}
      <div className="flex-none bg-white border-b border-[var(--color-eds-border)] h-14 flex items-center justify-between px-4 shadow-sm z-30">
        <div className="flex items-center">
          <Button variant="ghost" className="h-9 px-3 mr-4 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={() => setActiveTab('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
          <div className="h-6 w-px bg-slate-300 mx-2"></div>
          <div className="flex items-center space-x-1 ml-2">
            <span className="font-bold text-slate-800 text-sm">Enterprise KSP Workspace</span>
          </div>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" className={`h-9 px-3 ${activeWorkspaceTab === 'pratinjau' ? 'bg-indigo-100 text-indigo-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => setActiveWorkspaceTab("pratinjau")} title="Pratinjau Dokumen">
            <FileText className="w-4 h-4 mr-2" /> Pratinjau
          </Button>
          <Button variant="ghost" className={`h-9 px-3 ${activeWorkspaceTab === 'lampiran' ? 'bg-indigo-100 text-indigo-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => setActiveWorkspaceTab("lampiran")} title="Smart Attachments">
            <Paperclip className="w-4 h-4 mr-2" /> Lampiran
          </Button>
          <Button variant="ghost" className={`h-9 px-3 ${activeWorkspaceTab === 'validasi' ? 'bg-indigo-100 text-indigo-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => setActiveWorkspaceTab("validasi")} title="Validasi">
            <ShieldCheck className="w-4 h-4 mr-2" /> Validasi
          </Button>

          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'preview' && activeWorkspaceTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveWorkspaceTab("pratinjau"); setWorkspaceMode('preview'); }} title="Preview">
            <Eye className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'edit' && activeWorkspaceTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveWorkspaceTab("pratinjau"); setWorkspaceMode('edit'); }} title="Edit Mode">
            <Edit3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'printPreview' && activeWorkspaceTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveWorkspaceTab("pratinjau"); setWorkspaceMode('printPreview'); }} title="Print Preview">
            <Printer className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className={`w-9 h-9 p-0 ${workspaceState.workspaceMode === 'developer' && activeWorkspaceTab === 'pratinjau' ? 'bg-blue-100 text-blue-700' : 'text-[var(--color-eds-text-secondary)] hover:bg-slate-100'}`} onClick={() => { setActiveWorkspaceTab("pratinjau"); setWorkspaceMode('developer'); }} title="Developer">
            <Code className="w-5 h-5" />
          </Button>

          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <Button variant="outline" className="h-9 px-3 gap-2 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => window.print()} title="Cetak Draft">
            <Printer className="w-4 h-4" /> Print Draft
          </Button>

          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => {}} title="Ekspor PDF">
            <FileDown className="w-5 h-5 text-rose-600" />
          </Button>
          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => {}} title="Ekspor DOCX">
            <Download className="w-5 h-5 text-[var(--color-eds-text-primary)] font-bold" />
          </Button>
          
          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          <div className="flex items-center bg-slate-100 rounded-xl px-2 py-1 mr-2">
            <Button variant="ghost" className="w-7 h-7 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-200" onClick={() => setZoom(Math.max(50, zoom - 25))}><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="ghost" className="w-auto min-w-[3rem] h-7 p-0 text-xs font-bold text-[var(--color-eds-text-primary)] hover:bg-slate-200 rounded" onClick={() => setZoom(100)} title="Reset Zoom">{zoom}%</Button>
            <Button variant="ghost" className="w-7 h-7 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-200" onClick={() => setZoom(Math.min(200, zoom + 25))}><ZoomIn className="w-4 h-4" /></Button>
          </div>

          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 transition-all" onClick={toggleFullscreen} title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* WORKSPACE CONTENT */}
      <div className="flex-1 overflow-auto bg-slate-100 relative">
        {activeWorkspaceTab === "pratinjau" && (
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }} className="h-full">
             <EnterpriseDocumentViewer settings={settings} title="Kurikulum Satuan Pendidikan (KSP)" document={dummyDocument as any} generatedBy={settings.principal?.name || "Kepala Sekolah"} />
          </div>
        )}

        {activeWorkspaceTab === "lampiran" && (
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
                         <h4 className="font-bold text-slate-800">{att.name}</h4>
                         <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Missing</span>
                       </div>
                     </div>
                     <div className="flex space-x-2">
                       <Button variant="outline" size="sm">Generate Draft</Button>
                       <Button size="sm">Upload</Button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {activeWorkspaceTab === "validasi" && (
          <div className="p-8 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
             <div className="bg-white rounded-xl border border-[var(--color-eds-border)] p-8 shadow-sm">
               <h2 className="text-2xl font-black mb-2 text-slate-800">Enterprise Validation Panel</h2>
               <p className="text-[var(--color-eds-text-secondary)] mb-8 font-medium">Hasil pengecekan kelengkapan dan kesesuaian KSP.</p>
               <div className="space-y-4">
                 {validations.map((val, i) => (
                   <div key={i} className={`p-4 border-l-4 rounded-r-lg ${val.status === 'error' ? 'bg-rose-50 border-rose-500 text-rose-900' : 'bg-amber-50 border-amber-500 text-amber-900'}`}>
                     <div className="flex items-start">
                       <div className="mr-3 mt-0.5">
                         {val.status === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-600" /> : <Info className="w-5 h-5 text-amber-600" />}
                       </div>
                       <div>
                         <h4 className="font-bold uppercase text-xs tracking-wider mb-1 opacity-80">{val.type}</h4>
                         <p className="font-medium text-sm">{val.message}</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {activeTab === 'dashboard' ? renderDashboard() : renderWorkspace()}
    </div>
  );
};
