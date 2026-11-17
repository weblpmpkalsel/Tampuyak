import fs from 'fs';

const filePath = 'src/Tampuyak.tsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { RaporIntelligenceEngine }')) {
  // Insert import after standard imports
  content = content.replace(
    'import React, {',
    'import { RaporIntelligenceEngine } from "./RaporIntelligenceEngine";\nimport React, {'
  );
}

// Replace RaporPendidikanView
const startIdx = content.indexOf('const RaporPendidikanView = () => {');
const nextIdx = content.indexOf('const DocumentWorkspaceView', startIdx); 

if (startIdx !== -1 && nextIdx !== -1) {
  const replacement = `const RaporPendidikanView = () => {
  const { settings, updateSetting } = useApp();
  const [viewMode, setViewMode] = useState<"dashboard" | "ringkasan" | "lengkap" | "irb">("dashboard");
  
  const raporData = settings.rapor || { isLocked: false, data: {}, target: {} };
  
  // RPIE Engine Initialization
  const rpie = React.useMemo(() => {
    const engine = new RaporIntelligenceEngine();
    engine.loadData(raporData.data, RaporDictionary);
    return engine;
  }, [raporData.data]);

  const dimensions = rpie.getDimensions();
  const allIndicators = rpie.getAllIndicators();
  const swot = rpie.getSWOT();
  const irbActions = rpie.getIRB();
  const topPriorities = rpie.getTopPriorities(5);

  const totalIndikator = allIndicators.length;
  const filledIndikator = allIndicators.filter(i => i.value > 0).length;
  const persentase = totalIndikator > 0 ? Math.round((filledIndikator / totalIndikator) * 100) : 0;
  
  const status = raporData.isLocked ? "Terkunci" : persentase === 100 ? "Final" : "Draft";

  const handleUpdate = (id: string, field: string, value: string) => {
    if (raporData.isLocked) return;
    const currentObj = raporData.data[id] || { nilai: "", kategori: "", catatan: "" };
    const updatedObj = { ...currentObj, [field]: value };
    if (field === "nilai") {
      updatedObj.kategori = Number(value) >= 80 ? "Hijau" : Number(value) >= 60 ? "Kuning" : "Merah";
    }
    updateSetting("rapor", "data", { ...raporData.data, [id]: updatedObj });
  };

  const handleToggleLock = () => {
    if (raporData.isLocked) {
      const reason = prompt("Masukkan alasan membuka kunci Rapor Pendidikan:");
      if (reason) {
        updateSetting("rapor", "isLocked", false);
        updateSetting("rapor", "history", [...(raporData.history || []), { action: "UNLOCK", reason, date: Date.now() }]);
      }
    } else {
      if (persentase < 100) return alert("Lengkapi semua data terlebih dahulu.");
      const confirm = window.confirm("Saya menyatakan data telah sesuai dengan Rapor Pendidikan. Kunci data sekarang?");
      if (confirm) {
        updateSetting("rapor", "isLocked", true);
        updateSetting("rapor", "lockDate", Date.now());
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PageHelp 
        title="Rapor Pendidikan Intelligence Engine" 
        description="Mengekstraksi, menganalisis, dan merumuskan langkah strategis sekolah berdasarkan Rapor Pendidikan." 
        importance="RPIE memetakan indikator secara otomatis ke dokumen hilir (KSP, RKJM, RKT, RKAS)." 
        nextStep="Lengkapi data indikator, periksa dashboard analisis SWOT & IRB, dan validasi kunci." 
        checklist={["Ekstraksi Dimensi & Indikator", "Kalkulasi Prioritas", "Perumusan IRB", "Sertifikasi Data"]}
      />
      
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Educational Intelligence Dashboard</h2>
          <p className="text-slate-500 font-medium">Analisis cerdas capaian Rapor Pendidikan Nasional.</p>
        </div>
        <div className="flex gap-3 items-center">
          <span className={\`px-4 py-2 rounded-full font-bold text-sm \${status === "Terkunci" ? "bg-indigo-100 text-indigo-700" : status === "Final" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}\`}>
            Status: {status} ({persentase}%)
          </span>
          <Button icon={raporData.isLocked ? Edit2 : Lock} onClick={handleToggleLock} variant={raporData.isLocked ? "outline" : "default"}>
            {raporData.isLocked ? "Buka Kunci RPIE" : "Validasi & Kunci RPIE"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["dashboard", "ringkasan", "lengkap", "irb"].map(tab => (
          <button key={tab} onClick={() => setViewMode(tab as any)} className={\`px-6 py-4 font-bold border-b-2 transition-colors capitalize \${viewMode === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}\`}>
            {tab === "irb" ? "Auto-IRB Engine" : tab}
          </button>
        ))}
      </div>

      {viewMode === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 border-none">
               <div className="font-bold mb-2">Coverage Analytics</div>
               <div className="text-3xl font-black">{persentase}%</div>
               <div className="text-sm opacity-80 mt-1">{filledIndikator} dari {totalIndikator} Indikator Diekstraksi</div>
             </Card>
             <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 border-none">
               <div className="font-bold mb-2">Isu Prioritas (Gap Tertinggi)</div>
               <div className="text-3xl font-black">{swot.weaknesses.length}</div>
               <div className="text-sm opacity-80 mt-1">Memerlukan intervensi segera</div>
             </Card>
             <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 border-none">
               <div className="font-bold mb-2">Kekuatan Sekolah</div>
               <div className="text-3xl font-black">{swot.strengths.length}</div>
               <div className="text-sm opacity-80 mt-1">Aset pencapaian target nasional</div>
             </Card>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">Top 5 Prioritas Pembenahan (Berdasarkan Priority Engine)</div>
            <div className="p-4 space-y-3">
              {topPriorities.map((ind, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-rose-50 border border-rose-100 rounded-lg">
                   <div>
                     <div className="font-bold text-rose-900">{ind.id} - {ind.name}</div>
                     <div className="text-sm text-rose-700">Skor Prioritas: {ind.priorityScore} | Gap: {ind.gap.toFixed(2)}</div>
                   </div>
                   <div className="px-3 py-1 bg-white text-rose-800 text-sm font-bold rounded-md">Nilai: {ind.value}</div>
                </div>
              ))}
              {topPriorities.length === 0 && <div className="text-slate-500 italic p-4 text-center">Belum ada prioritas terdeteksi. Silakan lengkapi data Rapor.</div>}
            </div>
          </div>
        </div>
      )}

      {viewMode === "irb" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
           <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">Engine Identifikasi, Refleksi, Benahi (IRB)</div>
           <div className="p-4 space-y-4">
             {irbActions.map((irb, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold flex gap-2 items-center">
                     <AlertTriangle className="w-5 h-5 text-amber-500" /> Akar Masalah: {irb.refleksi.relatedElementId}
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <div className="text-sm font-bold text-slate-500 mb-1">Identifikasi (I)</div>
                       <div className="font-medium">{irb.identifikasi.name} ({irb.identifikasi.value})</div>
                     </div>
                     <div>
                       <div className="text-sm font-bold text-slate-500 mb-1">Refleksi (R)</div>
                       <div className="font-medium text-amber-800">{irb.refleksi.description}</div>
                     </div>
                     <div>
                       <div className="text-sm font-bold text-slate-500 mb-1">Benahi (B)</div>
                       <div className="font-medium text-indigo-700">{irb.benahi}</div>
                       <div className="text-xs text-slate-400 mt-2 italic border-t border-slate-100 pt-2">Reasoning: {irb.rationale}</div>
                     </div>
                  </div>
                </div>
             ))}
             {irbActions.length === 0 && <div className="p-12 text-center text-slate-500 italic">Data IRB akan dihasilkan otomatis setelah isu prioritas ditarik.</div>}
           </div>
        </div>
      )}

      {viewMode === "ringkasan" && (
         <div className="grid grid-cols-1 gap-6">
            {dimensions.map((dim, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                 <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">{dim.name}</div>
                 <div className="p-4 flex justify-between items-center">
                    <div className="font-bold text-lg">Skor Rata-Rata: {dim.score.toFixed(2)}</div>
                    <div className={\`px-3 py-1 rounded-full text-sm font-bold \${dim.category === 'Baik' ? 'bg-emerald-100 text-emerald-800' : dim.category === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}\`}>Kategori: {dim.category}</div>
                 </div>
              </div>
            ))}
         </div>
      )}

      {viewMode === "lengkap" && (
        <div className="space-y-6">
          {dimensions.map((dim, dimIdx) => (
            <div key={dimIdx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">{dim.name}</div>
              <div className="p-4">
              <table className="w-full text-left text-sm mt-4">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="pb-2 font-bold w-16">Kode</th>
                    <th className="pb-2 font-bold">Indikator Rapor Pendidikan</th>
                    <th className="pb-2 font-bold text-center w-32">Nilai Saat Ini</th>
                    <th className="pb-2 font-bold text-center w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dim.elements.flatMap(e => e.indicators).map((ind, indIdx) => (
                    <tr key={indIdx} className="hover:bg-slate-50">
                      <td className="py-3 font-mono text-slate-500">{ind.id}</td>
                      <td className="py-3 pr-4">{ind.name}</td>
                      <td className="py-3">
                        <input
                          type="number"
                          className="w-full text-center p-2 bg-slate-50 border border-slate-200 rounded-md focus:border-indigo-500 outline-none"
                          value={raporData.data[ind.id]?.nilai || ""}
                          onChange={(e) => handleUpdate(ind.id, "nilai", e.target.value)}
                          disabled={raporData.isLocked}
                          placeholder="0-100"
                        />
                      </td>
                      <td className="py-3 text-center">
                        {ind.value > 0 ? (
                           <span className={\`px-3 py-1 rounded-full text-xs font-bold \${ind.status === 'Hijau' ? 'bg-emerald-100 text-emerald-700' : ind.status === 'Kuning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}\`}>{ind.status}</span>
                        ) : <span className="text-slate-400">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
\n`;
  content = content.slice(0, startIdx) + replacement + content.slice(nextIdx);
  fs.writeFileSync(filePath, content);
  console.log("Injected RPIE view logic successfully!");
} else {
  console.log("Could not find RaporPendidikanView bounds.", startIdx, nextIdx);
}
