const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const relationalPlanningCode = `
const RelationalPlanningView = ({ initialTab, navigateToView }: any) => {
  const { settings, updateSetting, showSuccess } = useApp();
  const [activeYear, setActiveYear] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab || "rkjm");
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize or get planning data
  const planning = settings.relationalPlanning || {
    objectives: [
      {
        id: "OBJ-001",
        strategicObjective: "Peningkatan Kompetensi Pedagogik Guru",
        performanceIndicator: "Skor Literasi Rapor Pendidikan > 80",
        baseline: "65",
        targetY1: "70",
        targetY2: "75",
        targetY3: "80",
        targetY4: "85",
        responsibleUnit: "Waka Kurikulum",
        successIndicator: "90% Guru Lulus Sertifikasi PMM",
        associatedSnp: "Standar Pendidik dan Tenaga Kependidikan",
        risk: "Resistensi terhadap teknologi",
        mitigation: "Pendampingan intensif teman sejawat",
        evaluationMethod: "Observasi Kelas",
        originatingPriority: "Hasil Rapor A.1 (Kemampuan Literasi)"
      }
    ],
    annualPlans: {
      "Y1": {
        rkt: [
          { id: "RKT-Y1-001", rkjmObjectiveId: "OBJ-001", activity: "Pelatihan Literasi Digital untuk Guru", target: "20 Guru", status: "synced" }
        ],
        rkas: [
          { id: "RKAS-Y1-001", rktActivityId: "RKT-Y1-001", budgetItem: "Honor Narasumber Pelatihan", accountCode: "5.1.02.01", fundingSource: "BOS Reguler", amount: 1500000, status: "draft" },
          { id: "RKAS-Y1-002", rktActivityId: "RKT-Y1-001", budgetItem: "Konsumsi Peserta Pelatihan", accountCode: "5.1.02.02", fundingSource: "BOS Reguler", amount: 2000000, status: "draft" }
        ],
        monitoring: [
          { id: "MON-Y1-001", rkasId: "RKAS-Y1-001", evidence: "Daftar Hadir & Foto Kegiatan", result: "Terlaksana 100%" }
        ],
        evaluation: [
          { id: "EV-Y1-001", objectiveId: "OBJ-001", status: "Tercapai", notes: "Target tahun 1 terpenuhi." }
        ]
      },
      "Y2": { rkt: [], rkas: [], monitoring: [], evaluation: [] },
      "Y3": { rkt: [], rkas: [], monitoring: [], evaluation: [] },
      "Y4": { rkt: [], rkas: [], monitoring: [], evaluation: [] }
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showSuccess("Siklus Perencanaan Berhasil Disinkronkan", "Semua data RKJM, RKT, dan RKAS terhubung dalam satu jalur.");
    }, 1500);
  };

  const renderRKJM = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-indigo-900 text-lg">Master Plan RKJM (4 Tahun)</h3>
          <p className="text-indigo-700 text-sm">Rencana Strategis Jangka Menengah Sekolah.</p>
        </div>
        <Button onClick={handleSync} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <RefreshCw className={isSyncing ? "w-4 h-4 mr-2 animate-spin" : "w-4 h-4 mr-2"} />
          Sinkronisasi RKJM
        </Button>
      </div>

      <div className="space-y-4">
        {planning.objectives.map((obj: any, idx: number) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">ID: {obj.id} • {obj.associatedSnp}</span>
                <h4 className="font-bold text-slate-800 text-lg">{obj.strategicObjective}</h4>
                <p className="text-sm text-slate-500 font-medium">{obj.originatingPriority}</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">4 Tahun</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-4 mb-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baseline</span>
                <span className="font-bold text-slate-700">{obj.baseline}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Y1</span>
                <span className="font-bold text-slate-700">{obj.targetY1}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Y2</span>
                <span className="font-bold text-slate-700">{obj.targetY2}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Y3 & Y4</span>
                <span className="font-bold text-slate-700">{obj.targetY3} / {obj.targetY4}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong className="text-slate-800">Unit:</strong> {obj.responsibleUnit}</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong className="text-slate-800">Risiko:</strong> {obj.risk}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-800">Mitigasi:</strong> {obj.mitigation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const currentYearPlan = (planning.annualPlans as any)["Y" + activeYear];

  const renderRKT = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-blue-900 text-lg">Rencana Kerja Tahunan (RKT) - Tahun {activeYear}</h3>
          <p className="text-blue-700 text-sm">Diturunkan secara otomatis dari RKJM.</p>
        </div>
      </div>
      
      {currentYearPlan.rkt.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada turunan program RKT untuk Tahun {activeYear}.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {currentYearPlan.rkt.map((act: any, idx: number) => {
             const parentObj = planning.objectives.find((o:any) => o.id === act.rkjmObjectiveId);
             return (
               <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Induk: {parentObj?.strategicObjective}</span>
                        <h4 className="font-bold text-slate-800 text-lg">{act.activity}</h4>
                     </div>
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase">{act.status}</span>
                  </div>
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <span className="font-medium text-slate-500">Target Pelaksanaan:</span> <span className="font-bold text-slate-800">{act.target}</span>
                  </div>
               </div>
             )
           })}
         </div>
      )}
    </div>
  );

  const renderRKAS = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-emerald-900 text-lg">Rencana Anggaran (RKAS) - Tahun {activeYear}</h3>
          <p className="text-emerald-700 text-sm">Alokasi dana untuk implementasi RKT.</p>
        </div>
      </div>
      
      {currentYearPlan.rkas.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada rincian anggaran RKAS untuk Tahun {activeYear}.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {currentYearPlan.rkas.map((budg: any, idx: number) => {
             const parentRkt = currentYearPlan.rkt.find((r:any) => r.id === budg.rktActivityId);
             return (
               <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Program: {parentRkt?.activity}</span>
                        <h4 className="font-bold text-slate-800 text-lg">{budg.budgetItem}</h4>
                     </div>
                     <span className="font-black text-emerald-600">Rp {budg.amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded font-medium">Kode: {budg.accountCode}</span>
                     <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded font-medium">Sumber: {budg.fundingSource}</span>
                  </div>
               </div>
             )
           })}
         </div>
      )}
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center bg-amber-50 border border-amber-100 p-4 rounded-xl">
        <div>
          <h3 className="font-bold text-amber-900 text-lg">Monitoring & Evaluasi - Tahun {activeYear}</h3>
          <p className="text-amber-700 text-sm">Bukti fisik pelaksanaan anggaran dan capaian target RKJM.</p>
        </div>
      </div>
      
      {currentYearPlan.monitoring.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada data monitoring untuk Tahun {activeYear}.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {currentYearPlan.monitoring.map((mon: any, idx: number) => {
             const parentRkas = currentYearPlan.rkas.find((r:any) => r.id === mon.rkasId);
             const parentRkt = currentYearPlan.rkt.find((r:any) => r.id === parentRkas?.rktActivityId);
             return (
               <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center"><Link2 className="w-3 h-3 mr-1" /> Anggaran: {parentRkas?.budgetItem}</span>
                        <h4 className="font-bold text-slate-800 text-lg">Bukti: {mon.evidence}</h4>
                     </div>
                     <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">{mon.result}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-600">
                     Keterkaitan RKJM: <strong className="text-slate-800">{planning.objectives.find((o:any) => o.id === parentRkt?.rkjmObjectiveId)?.strategicObjective}</strong>
                  </div>
               </div>
             )
           })}
         </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
           <div>
             <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-2 flex items-center">
               Relational Planning Workspace
             </h1>
             <p className="text-slate-500 font-medium">Sistem Perencanaan Terpadu (RKJM → RKT → RKAS → Evaluasi)</p>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-xl">
             {[1, 2, 3, 4].map(y => (
               <button 
                 key={y} 
                 onClick={() => { setActiveYear(y); if(activeTab==='rkjm') setActiveTab('rkt'); }}
                 className={"px-4 py-2 rounded-lg text-sm font-bold transition-all " + (activeYear === y ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
               >
                 Tahun {y}
               </button>
             ))}
           </div>
        </div>

        <div className="flex border-b border-slate-200 mb-6 space-x-6">
           <button onClick={() => setActiveTab("rkjm")} className={"pb-3 text-sm font-bold border-b-2 transition-all " + (activeTab === "rkjm" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700")}>Master RKJM</button>
           <button onClick={() => setActiveTab("rkt")} className={"pb-3 text-sm font-bold border-b-2 transition-all " + (activeTab === "rkt" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700")}>RKT Tahun {activeYear}</button>
           <button onClick={() => setActiveTab("rkas")} className={"pb-3 text-sm font-bold border-b-2 transition-all " + (activeTab === "rkas" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700")}>RKAS Tahun {activeYear}</button>
           <button onClick={() => setActiveTab("monitoring")} className={"pb-3 text-sm font-bold border-b-2 transition-all " + (activeTab === "monitoring" ? "border-amber-500 text-amber-700" : "border-transparent text-slate-500 hover:text-slate-700")}>Pelaksanaan & Evaluasi</button>
        </div>

        {activeTab === "rkjm" && renderRKJM()}
        {activeTab === "rkt" && renderRKT()}
        {activeTab === "rkas" && renderRKAS()}
        {activeTab === "monitoring" && renderMonitoring()}

      </div>
    </div>
  );
};
`;

// Now let's completely remove the old components.
const removeComponent = (compName, source) => {
  const startRegex = new RegExp("const " + compName + " =[^\\n]*=>\\s*\\{");
  const match = source.match(startRegex);
  if (!match) return source;
  
  let startIndex = match.index;
  
  // Find matching closing brace
  let openBraces = 0;
  let inComponent = false;
  let endIndex = -1;
  
  for (let i = startIndex; i < source.length; i++) {
    if (source[i] === '{') {
      openBraces++;
      inComponent = true;
    } else if (source[i] === '}') {
      openBraces--;
    }
    
    if (inComponent && openBraces === 0) {
      // Find the end of the line if there's a semicolon
      let j = i + 1;
      while(j < source.length && (source[j] === ';' || source[j] === '\\n' || source[j] === '\\r')) {
        j++;
      }
      endIndex = j;
      break;
    }
  }
  
  if (endIndex !== -1) {
    return source.substring(0, startIndex) + source.substring(endIndex);
  }
  
  return source;
};

let newCode = code;
newCode = removeComponent('RKJMPipelineView', newCode);
newCode = removeComponent('RKTDerivationView', newCode);
newCode = removeComponent('RKASDerivationView', newCode);
newCode = removeComponent('MonitoringView', newCode);

// Inject the new component where RKJMPipelineView used to be roughly
const injectIndex = newCode.indexOf('const GenerationDiagnosticView');
if (injectIndex !== -1) {
  newCode = newCode.slice(0, injectIndex) + relationalPlanningCode + '\n' + newCode.slice(injectIndex);
} else {
  // fallback
  newCode = newCode.replace('const App =', relationalPlanningCode + '\n\nconst App =');
}

// Update Routing in Tampuyak.tsx
newCode = newCode.replace(
  /\{currentView === "rkjmPipeline" && <RKJMPipelineView navigateToView=\{setCurrentView\} \/>\}/g, 
  '{currentView === "rkjmPipeline" && <RelationalPlanningView initialTab="rkjm" navigateToView={setCurrentView} />}'
);

const routeRegexRKT = /\{currentView === "rktDerivation" && \([\s\S]*?<\/RKTDerivationView>[\s\S]*?\)\}/g;
newCode = newCode.replace(routeRegexRKT, '{currentView === "rktDerivation" && <RelationalPlanningView initialTab="rkt" navigateToView={setCurrentView} />}');

const routeRegexRKT2 = /\{currentView === "rktDerivation" && <RKTDerivationView[^>]*>\}/g;
newCode = newCode.replace(routeRegexRKT2, '{currentView === "rktDerivation" && <RelationalPlanningView initialTab="rkt" navigateToView={setCurrentView} />}');

const routeRegexRKAS = /\{currentView === "rkasDerivation" && <RKASDerivationView[^>]*>\}/g;
newCode = newCode.replace(routeRegexRKAS, '{currentView === "rkasDerivation" && <RelationalPlanningView initialTab="rkas" navigateToView={setCurrentView} />}');

const routeRegexMonitoring = /\{currentView === "monitoring" && <MonitoringView[^>]*>\}/g;
newCode = newCode.replace(routeRegexMonitoring, '{currentView === "monitoring" && <RelationalPlanningView initialTab="monitoring" navigateToView={setCurrentView} />}');

// Now we need to update Document Engine Narratives (BAB II, III, IV)
const bab2Replacement = `
            {activeChapter === "bab2" && (
              <div id="bab2" className="mt-8 page-break-after">
                <h2 className="text-xl font-bold mb-6 uppercase text-center border-b-2 border-slate-900 pb-2">BAB II<br/>Analisis Kondisi dan Lingkungan Strategis Sekolah</h2>
                <div className="space-y-4">
                   <h3 className="font-bold text-lg">2.1. Profil dan Konteks Regional Sekolah</h3>
                   <p className="text-justify indent-8">Sekolah {settings.school?.name || "..."} merupakan institusi pendidikan yang berada di bawah naungan dinas pendidikan setempat, mengemban tugas untuk mencerdaskan kehidupan bangsa di tingkat satuan pendidikan. Konteks geografis dan demografis dari siswa-siswi yang belajar di institusi ini membutuhkan pendekatan yang komprehensif, mengedepankan kearifan lokal tanpa meninggalkan tuntutan kompetensi global.</p>
                   
                   <h3 className="font-bold text-lg mt-6">2.2. Analisis Sumber Daya Pendidik dan Tenaga Kependidikan</h3>
                   <p className="text-justify indent-8">Berdasarkan data profil guru, rasio pendidik dengan jumlah peserta didik secara umum telah memadai. Namun demikian, terdapat beberapa area pengembangan kompetensi pedagogik dan profesionalisme yang masih perlu ditingkatkan, terutama terkait implementasi kurikulum merdeka dan pemanfaatan teknologi digital dalam pembelajaran sehari-hari.</p>

                   <h3 className="font-bold text-lg mt-6">2.3. Interpretasi Hasil Rapor Pendidikan</h3>
                   <p className="text-justify indent-8">Data Rapor Pendidikan menunjukkan capaian pada indikator literasi dan numerasi yang memerlukan penguatan. Skor pada aspek keamanan iklim sekolah menunjukkan hasil positif, namun aspek kebhinekaan perlu mendapatkan perhatian. {settings.decisionEngine?.status === "Disetujui" ? "Analisis akar masalah telah dilakukan secara mendalam, mengidentifikasi faktor-faktor determinan yang menjadi penyebab utama capaian tersebut." : "Rapor Pendidikan menjadi pijakan kuat untuk merumuskan intervensi."}</p>

                   <h3 className="font-bold text-lg mt-6">2.4. Analisis SWOT dan Identifikasi Isu Strategis</h3>
                   <p className="text-justify indent-8">Melalui pemetaan kekuatan (Strengths), kelemahan (Weaknesses), peluang (Opportunities), dan ancaman (Threats), sekolah telah menyusun prioritas strategis. Isu strategis utama yang mengemuka adalah peningkatan kualitas pembelajaran yang berdiferensiasi dan penguatan karakter Profil Pelajar Pancasila di setiap lini kegiatan intrakurikuler maupun ekstrakurikuler.</p>
                   <div className="my-6">
                      <table className="w-full text-sm border-collapse border border-slate-900">
                         <thead>
                            <tr className="bg-slate-100"><th className="border border-slate-900 p-2">Kekuatan (Strengths)</th><th className="border border-slate-900 p-2">Kelemahan (Weaknesses)</th></tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td className="border border-slate-900 p-2">1. Dukungan komite dan orang tua yang kuat<br/>2. Sarana prasarana inti memadai</td>
                               <td className="border border-slate-900 p-2">1. Capaian literasi dan numerasi siswa<br/>2. Pemanfaatan perangkat TIK oleh guru</td>
                            </tr>
                         </tbody>
                         <thead>
                            <tr className="bg-slate-100"><th className="border border-slate-900 p-2">Peluang (Opportunities)</th><th className="border border-slate-900 p-2">Ancaman (Threats)</th></tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td className="border border-slate-900 p-2">1. Program bantuan pemerintah daerah<br/>2. Kemitraan dengan komunitas literasi lokal</td>
                               <td className="border border-slate-900 p-2">1. Penurunan motivasi belajar pasca jam sekolah<br/>2. Distraksi teknologi informasi negatif</td>
                            </tr>
                         </tbody>
                      </table>
                      <p className="text-xs text-slate-500 mt-2 text-center italic">Tabel 2.1 - Matriks Analisis SWOT Satuan Pendidikan</p>
                   </div>
                   
                   <h3 className="font-bold text-lg mt-6">2.5. Rekomendasi dan Kesimpulan Analisis</h3>
                   <p className="text-justify indent-8">Berdasarkan pemaparan kondisi riil di atas, disimpulkan bahwa intervensi harus difokuskan pada peningkatan kapasitas guru melalui Komunitas Belajar, serta penyediaan fasilitas perpustakaan digital untuk mendongkrak capaian literasi dan numerasi. Kesimpulan ini akan diterjemahkan menjadi sasaran strategis pada perumusan program kerja.</p>
                </div>
              </div>
            )}
`;

const bab3Replacement = `
            {activeChapter === "bab3" && (
              <div id="bab3" className="mt-8 page-break-after">
                <h2 className="text-xl font-bold mb-6 uppercase text-center border-b-2 border-slate-900 pb-2">BAB III<br/>Perumusan Program dan Strategi Implementasi</h2>
                <div className="space-y-4">
                   <h3 className="font-bold text-lg">3.1. Sasaran Strategis (Master Plan)</h3>
                   <p className="text-justify indent-8">Sasaran strategis diturunkan langsung dari analisis kesenjangan mutu. Rencana Kerja Jangka Menengah (RKJM) memetakan sasaran ini dalam proyeksi 4 (empat) tahun, dengan target yang dievaluasi per tahun pelajaran untuk memastikan progres yang berkesinambungan.</p>
                   
                   <div className="my-6">
                      <table className="w-full text-[11px] border-collapse border border-slate-900 mb-2">
                         <thead>
                            <tr className="bg-slate-100">
                               <th className="border border-slate-900 p-2">ID</th>
                               <th className="border border-slate-900 p-2">Sasaran Strategis</th>
                               <th className="border border-slate-900 p-2">Baseline</th>
                               <th className="border border-slate-900 p-2">Target Y1</th>
                               <th className="border border-slate-900 p-2">Target Y2</th>
                               <th className="border border-slate-900 p-2">Mitigasi Risiko</th>
                            </tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td className="border border-slate-900 p-2 text-center">OBJ-001</td>
                               <td className="border border-slate-900 p-2">Peningkatan Kompetensi Pedagogik Guru</td>
                               <td className="border border-slate-900 p-2 text-center">65</td>
                               <td className="border border-slate-900 p-2 text-center">70</td>
                               <td className="border border-slate-900 p-2 text-center">75</td>
                               <td className="border border-slate-900 p-2">Pendampingan intensif teman sejawat</td>
                            </tr>
                         </tbody>
                      </table>
                      <p className="text-xs text-slate-500 mt-1 text-center italic">Tabel 3.1 - Matriks Sasaran Strategis Jangka Menengah</p>
                   </div>

                   <h3 className="font-bold text-lg mt-6">3.2. Strategi Implementasi dan Indikator Kinerja</h3>
                   <p className="text-justify indent-8">Untuk merealisasikan sasaran tersebut, sekolah menerapkan strategi implementasi yang berbasis pada pemberdayaan Unit Kerja. Setiap target Y1 (Tahun Pertama) diterjemahkan ke dalam Rencana Kerja Tahunan (RKT) yang spesifik dan terukur secara periodik. Indikator Kinerja diukur menggunakan instrumen evaluasi yang jelas, seperti rekapitulasi nilai kompetensi guru dan hasil belajar siswa.</p>

                   <h3 className="font-bold text-lg mt-6">3.3. Rencana Monitoring dan Evaluasi</h3>
                   <p className="text-justify indent-8">Mekanisme kontrol mutu diterapkan sejak awal tahun ajaran. Tim Pengembang Sekolah akan menyelenggarakan rapat evaluasi capaian RKT setiap akhir semester. Hasil dari monitoring ini akan menjadi pijakan untuk penetapan RKT Tahun ke-2 dan penyesuaian RKAS.</p>
                </div>
              </div>
            )}
`;

const bab4Replacement = `
            {activeChapter === "bab4" && (
              <div id="bab4" className="mt-8 page-break-after">
                <h2 className="text-xl font-bold mb-6 uppercase text-center border-b-2 border-slate-900 pb-2">BAB IV<br/>Kebijakan dan Rincian Anggaran (RKAS)</h2>
                <div className="space-y-4">
                   <h3 className="font-bold text-lg">4.1. Kebijakan Pendanaan Sekolah</h3>
                   <p className="text-justify indent-8">Kebijakan anggaran disusun berlandaskan prinsip efisiensi, efektivitas, transparansi, dan akuntabilitas. Segala bentuk pengeluaran anggaran dijamin linier dan terkait erat dengan aktivitas RKT yang telah disahkan pada BAB III. Pendanaan tidak difokuskan pada kegiatan operasional semata, melainkan memiliki proporsi yang cukup untuk membiayai program strategis penunjang capaian mutu Rapor Pendidikan.</p>
                   
                   <h3 className="font-bold text-lg mt-6">4.2. Distribusi Alokasi Anggaran Tahun 1</h3>
                   <p className="text-justify indent-8">Berdasarkan struktur RKAS, rencana belanja dirumuskan sesuai klasifikasi Standar Nasional Pendidikan (SNP). Anggaran terbesar dialokasikan untuk pemenuhan Standar Pendidik dan Tenaga Kependidikan serta Standar Proses, sejalan dengan isu strategis hasil evaluasi Rapor Pendidikan.</p>

                   <div className="my-6">
                      <table className="w-full text-xs border-collapse border border-slate-900 mb-2">
                         <thead>
                            <tr className="bg-slate-100">
                               <th className="border border-slate-900 p-2">Kode Rekening</th>
                               <th className="border border-slate-900 p-2">Uraian / Rincian Belanja</th>
                               <th className="border border-slate-900 p-2">Sumber Dana</th>
                               <th className="border border-slate-900 p-2">Estimasi Biaya (Rp)</th>
                            </tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td className="border border-slate-900 p-2 text-center">5.1.02.01</td>
                               <td className="border border-slate-900 p-2">Honor Narasumber Pelatihan (Link: RKT-Y1-001)</td>
                               <td className="border border-slate-900 p-2 text-center">BOS Reguler</td>
                               <td className="border border-slate-900 p-2 text-right">1.500.000</td>
                            </tr>
                            <tr>
                               <td className="border border-slate-900 p-2 text-center">5.1.02.02</td>
                               <td className="border border-slate-900 p-2">Konsumsi Peserta Pelatihan (Link: RKT-Y1-001)</td>
                               <td className="border border-slate-900 p-2 text-center">BOS Reguler</td>
                               <td className="border border-slate-900 p-2 text-right">2.000.000</td>
                            </tr>
                         </tbody>
                      </table>
                      <p className="text-xs text-slate-500 mt-1 text-center italic">Tabel 4.1 - Ringkasan Rencana Kegiatan dan Anggaran Sekolah (RKAS) Tahun 1</p>
                   </div>
                   
                   <h3 className="font-bold text-lg mt-6">4.3. Keberlanjutan Finansial (Financial Sustainability)</h3>
                   <p className="text-justify indent-8">Guna mengantisipasi defisit dan memastikan keberlanjutan program jangka panjang (Tahun 2 hingga Tahun 4), sekolah merencanakan penggalian dana mandiri secara partisipatif yang tidak mengikat, serta menjalin kemitraan strategis dengan dunia usaha/industri sekitar dan alumni, dengan tetap berpedoman pada peraturan perundang-undangan yang berlaku.</p>
                </div>
              </div>
            )}
`;

// Replace BAB 2
const bab2Regex = /\{activeChapter === "bab2" && \([\s\S]*?<h2[\s\S]*?BAB II<br\/>Analisis Kondisi[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;
newCode = newCode.replace(bab2Regex, bab2Replacement);

// Replace BAB 3
const bab3Regex = /\{activeChapter === "bab3" && \([\s\S]*?<h2[\s\S]*?BAB III<br\/>Program Kerja[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;
newCode = newCode.replace(bab3Regex, bab3Replacement);

// Replace BAB 4
const bab4Regex = /\{activeChapter === "bab4" && \([\s\S]*?<h2[\s\S]*?BAB IV<br\/>Rencana Anggaran[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;
newCode = newCode.replace(bab4Regex, bab4Replacement);


fs.writeFileSync('src/Tampuyak.tsx', newCode);
console.log('Script execution complete!');
