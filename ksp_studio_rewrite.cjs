const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /const KSP_STAGES = \[[\s\S]*?(?=\n\nconst PublishingCenterView =)/;

const newKSPView = `const KSP_TEMPLATE_REGISTRY: Record<string, any> = {
  "SD Negeri": { level: "SD", type: "Negeri", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Dinas"] },
  "SD Swasta": { level: "SD", type: "Swasta", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Dinas", "Ketua Yayasan"] },
  "SMP Negeri": { level: "SMP", type: "Negeri", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Dinas"] },
  "SMP Swasta": { level: "SMP", type: "Swasta", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Dinas", "Ketua Yayasan"] },
  "SMA": { level: "SMA", type: "Umum", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Cabang Dinas"] },
  "SMK": { level: "SMK", type: "Vokasi", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Cabang Dinas", "Mitra DUDI"] },
  "SLB": { level: "SLB", type: "Khusus", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Kepala Bidang PKLK"] },
  "TK": { level: "TK", type: "Umum", pengesahan: ["Kepala Sekolah", "Ketua Komite", "Pengawas Pembina"] }
};

const KSP_STAGES_2025 = [
  { id: "karakteristik", title: "Karakteristik Satuan Pendidikan", desc: "Karakteristik PD, GTK, Sarpras, Budaya." },
  { id: "visi", title: "Visi", desc: "Cita-cita bersama di masa depan." },
  { id: "misi", title: "Misi", desc: "Cara mencapai Visi." },
  { id: "tujuan", title: "Tujuan", desc: "Fokus jangka menengah/pendek." },
  { id: "pengorganisasian", title: "Pengorganisasian Pembelajaran", desc: "Intra, Koku, Ekstra, Muatan Lokal." },
  { id: "perencanaan", title: "Perencanaan Pembelajaran", desc: "Prinsip, Asesmen, Berdiferensiasi." },
  { id: "evaluasi", title: "Evaluasi Implementasi", desc: "Refleksi, Pendampingan, PPG." },
  { id: "review", title: "Review & Validasi", desc: "Pemeriksaan DQA (Dokumen Quality Assurance)." },
  { id: "penetapan", title: "Penetapan", desc: "Nomor Dokumen, Keputusan, Masa Berlaku." },
  { id: "pengesahan", title: "Lembar Pengesahan", desc: "Penandatanganan Pejabat." },
];

const KspStageContent = ({ stageId, settings, setSettings, onComplete }: any) => {
  const [localText, setLocalText] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // KSP State initialization if not exists
  const kspState = settings.ksp || {};

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (stageId === "visi") {
        setAiSuggestions([
          "Mewujudkan lulusan yang berakhlak mulia, bernalar kritis, dan berwawasan lingkungan alam sekitar.",
          "Menjadi komunitas belajar sepanjang hayat yang unggul dalam teknologi dan berakar pada budaya lokal."
        ]);
      } else if (stageId === "tujuan") {
        setAiSuggestions([
          "Meningkatkan literasi dan numerasi siswa sebesar 20% dalam 2 tahun ke depan.",
          "Membentuk lingkungan sekolah yang bebas perundungan (zero bullying) dan ramah anak."
        ]);
      } else if (stageId === "misi") {
        setAiSuggestions([
          "1. Menyelenggarakan pembelajaran berbasis proyek yang mengintegrasikan nilai-nilai Pancasila.\\n2. Memfasilitasi pengembangan minat dan bakat melalui kegiatan ekstrakurikuler yang beragam."
        ]);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const applySuggestion = (text: string) => {
    setLocalText(text);
    setAiSuggestions([]);
  };

  const saveAndNext = () => {
    // In a real app, update global state here
    onComplete();
  };

  if (stageId === "karakteristik") {
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start">
          <Info className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-indigo-800">
            <strong>Otomatisasi:</strong> Data karakteristik telah ditarik secara otomatis dari Pusat Data Sekolah (Guru, Tendik, Sarpras, Peserta Didik, Potensi). Anda hanya perlu menyempurnakan narasi akhir di bawah ini.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <h4 className="font-bold text-slate-700 mb-2">Data Tercatat</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• Jumlah Guru: {settings.guru?.length || 0} orang</li>
              <li>• Jumlah Tendik: {settings.tendik?.length || 0} orang</li>
              <li>• Peserta Didik: {settings.pesertaDidik?.total || 0} siswa</li>
              <li>• Potensi: {settings.potensi?.daerah || "Belum diisi"}</li>
            </ul>
          </div>
        </div>
        <textarea 
          className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          placeholder="Sempurnakan narasi karakteristik sekolah di sini..."
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
        />
        <Button onClick={saveAndNext} className="w-full bg-indigo-600 hover:bg-indigo-700">Simpan & Lanjutkan</Button>
      </div>
    );
  }

  if (stageId === "visi" || stageId === "misi" || stageId === "tujuan") {
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <h4 className="font-bold text-slate-700 mb-2">Tuliskan Ide Anda</h4>
          <textarea 
            className="w-full h-24 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm mb-3"
            placeholder={\`Tulis ide \${stageId} di sini secara singkat...\`}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
          />
          <Button onClick={handleGenerate} variant="outline" className="w-full" disabled={!localText || isGenerating}>
            {isGenerating ? "Menganalisis..." : \`Minta AI Merapikan \${stageId === 'visi' ? 'Visi' : stageId === 'misi' ? 'Misi' : 'Tujuan'}\`}
          </Button>
        </div>

        {aiSuggestions.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-bold text-indigo-800 text-sm">Alternatif Redaksi AI:</h4>
            {aiSuggestions.map((sug, idx) => (
              <div key={idx} className="p-4 bg-white border border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => applySuggestion(sug)}>
                <p className="text-sm text-slate-700">{sug}</p>
                <div className="mt-3 text-xs font-bold text-indigo-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Gunakan Redaksi Ini
                </div>
              </div>
            ))}
          </div>
        )}
        <Button onClick={saveAndNext} className="w-full bg-indigo-600 hover:bg-indigo-700">Simpan & Lanjutkan</Button>
      </div>
    );
  }

  if (stageId === "pengorganisasian" || stageId === "perencanaan" || stageId === "evaluasi") {
    return (
      <div className="space-y-6">
         <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Gunakan panduan resmi KSP Revisi 2025 di sebelah kanan untuk menyusun bagian ini. Pastikan untuk menyesuaikan dengan Template Registry jenjang Anda.
          </p>
        </div>
        <textarea 
          className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
          placeholder="Ketik konten dokumen di sini..."
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
        />
        <Button onClick={saveAndNext} className="w-full bg-indigo-600 hover:bg-indigo-700">Simpan & Lanjutkan</Button>
      </div>
    );
  }

  if (stageId === "review") {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">DQA (Document Quality Assurance) Selesai</h3>
          <ul className="text-sm text-slate-600 text-left max-w-md mx-auto space-y-2 mb-6">
            <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Visi sinkron dengan Misi</li>
            <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Misi sinkron dengan Tujuan</li>
            <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Tidak ditemukan istilah lama (Silabus, KKM)</li>
            <li className="flex items-center"><Check className="w-4 h-4 text-emerald-500 mr-2"/> Tidak ada Null/Placeholder</li>
          </ul>
          <Button onClick={saveAndNext} className="w-full bg-indigo-600 hover:bg-indigo-700">Sahkan Dokumen</Button>
        </div>
      </div>
    );
  }

  if (stageId === "penetapan" || stageId === "pengesahan") {
    const isPenetapan = stageId === "penetapan";
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{isPenetapan ? "Data Penetapan Dokumen" : "Konfigurasi Lembar Pengesahan"}</h3>
          
          {isPenetapan ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nomor Dokumen" placeholder="Cth: 421.2/001/SD-XYZ/2025" />
              <Input label="Nomor Keputusan" placeholder="Cth: 800/002/SK/2025" />
              <Input label="Tanggal Penetapan" type="date" />
              <Input label="Tempat Penetapan" placeholder="Cth: Banjarmasin" />
              <Input label="Tahun Pelajaran" value={settings.academicYears?.find((y:any)=>y.isActive)?.name || ""} disabled />
              <Input label="Versi Dokumen" value="1.0" disabled />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm text-indigo-800">
                Dokumen akan ditandatangani oleh pejabat berikut sesuai Data Sekolah (Menu Pejabat Penandatangan).
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-700">Kepala Sekolah</span>
                  <span className="text-slate-500 text-sm">{settings.principal?.name || "Belum diatur"}</span>
                </li>
                <li className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-700">Ketua Komite</span>
                  <span className="text-slate-500 text-sm">{settings.komite?.name || "Belum diatur"}</span>
                </li>
                <li className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-700">Kepala Dinas</span>
                  <span className="text-slate-500 text-sm">{settings.kepalaDinas?.name || "Belum diatur"}</span>
                </li>
              </ul>
            </div>
          )}
        </div>
        <Button onClick={saveAndNext} className="w-full bg-indigo-600 hover:bg-indigo-700">{isPenetapan ? "Lanjut ke Pengesahan" : "Selesaikan KSP"}</Button>
      </div>
    );
  }

  return <div>Unknown Stage</div>;
};

const KSPStudioView = ({ navigateToView }: any) => {
  const { settings } = useApp();
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  
  const activeStage = KSP_STAGES_2025[activeStageIdx];

  const handleNext = () => {
    if (activeStageIdx < KSP_STAGES_2025.length - 1) {
      setActiveStageIdx(activeStageIdx + 1);
    } else {
      navigateToView("publishingCenter");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2 flex items-center">
          KSP Studio (Revisi 2025)
          <div className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
            Regulasi Edisi Terbaru
          </div>
        </h1>
        <p className="text-slate-500">Penyusunan Kurikulum Satuan Pendidikan terstruktur, ringkas, dan kontekstual.</p>
        
        <div className="mt-8 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-4">
          {KSP_STAGES_2025.map((stage, idx) => (
            <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => setActiveStageIdx(idx)}
                className={\`flex items-center px-4 py-2 rounded-full text-[12px] font-bold tracking-wide transition-all \${idx === activeStageIdx ? 'bg-indigo-600 text-white shadow-md' : idx < activeStageIdx ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}\`}
              >
                {idx < activeStageIdx && <Check className="w-3.5 h-3.5 mr-1.5" />}
                {idx + 1}. {stage.title}
              </button>
              {idx < KSP_STAGES_2025.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[500px]">
            <h2 className="text-2xl font-black text-slate-800 mb-2">{activeStage.title}</h2>
            <p className="text-sm text-slate-500 mb-8">{activeStage.desc}</p>
            <KspStageContent 
              stageId={activeStage.id} 
              settings={settings} 
              onComplete={handleNext} 
            />
          </div>
        </div>
        
        {/* Panduan Resmi Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-28">
            <div className="flex items-center text-indigo-600 mb-4">
              <BookOpen className="w-6 h-6 mr-3" />
              <h3 className="font-bold text-lg">Panduan Resmi</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700 mb-1">Dasar Regulasi</p>
                <p className="text-xs">Panduan Pengembangan Kurikulum Satuan Pendidikan Edisi Revisi 2025.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700 mb-1">Catatan Penting</p>
                <ul className="list-disc pl-4 text-xs space-y-1">
                  <li>KSP adalah dokumen hidup, ringkas, dan kontekstual.</li>
                  <li>Bukan laporan tebal yang bersifat administratif.</li>
                  <li>AI hanya bertindak sebagai asisten redaksi, keputusan final di tangan Tim Pengembang.</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700 mb-1">Target Template</p>
                <p className="text-xs text-indigo-600 font-medium">Berdasarkan Template Registry: KSP {settings.school?.jenjang || "Umum"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(regex, newKSPView);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('KSP Studio Refactored!');
