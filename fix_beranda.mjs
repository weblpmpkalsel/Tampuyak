import fs from 'fs';

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('const BerandaView = ({ navigateToView, navigateToSettings }: any) => {'));
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

const berandaCode = `const BerandaView = ({ navigateToView, navigateToSettings }: any) => {
  const { settings } = useApp();
  
  const activeYear = settings.academicYears?.find((y: any) => y.isActive);
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const docs = settings.documents || [];

  const completedSteps = [];
  const todoSteps = [];
  const attentionItems = [];

  if (settings.school.name !== "") completedSteps.push({ label: "Data Sekolah Lengkap", desc: "Profil dan identitas telah diisi" });
  else todoSteps.push({ label: "Lengkapi Data Sekolah", desc: "Dasar sistem memerlukan profil sekolah Anda.", action: () => navigateToSettings("school"), icon: Building2, color: "slate" });

  if (settings.rapor?.isLocked) completedSteps.push({ label: "Rapor Pendidikan Dimuat", desc: "Analisis sistem menggunakan rapor terbaru" });
  else todoSteps.push({ label: "Isi Rapor Pendidikan", desc: "Unggah atau sinkronisasikan rapor sekolah Anda.", action: () => navigateToView("rapor"), icon: BarChart3, color: "blue" });

  if (settings.diagnosis?.isLocked) completedSteps.push({ label: "Analisis Prioritas Selesai", desc: "Akar masalah telah teridentifikasi" });
  else if (settings.rapor?.isLocked) todoSteps.push({ label: "Lakukan Analisis Prioritas", desc: "Identifikasi program strategis sekolah.", action: () => navigateToView("diagnosis"), icon: Target, color: "indigo" });

  const rkjmDoc = docs.find((d: any) => d.type === "RKJM");
  if (rkjmDoc && ["Disetujui", "Terkunci", "Diarsipkan"].includes(rkjmDoc.status)) {
    completedSteps.push({ label: "RKJM Disetujui", desc: "Rencana Kerja Jangka Menengah versi " + (rkjmDoc.version || "1.0") });
  } else if (settings.diagnosis?.isLocked) {
    if (rkjmDoc) {
      if (rkjmDoc.status === "Review") attentionItems.push({ label: "RKJM Menunggu Review", desc: "Periksa catatan dari Kepala Sekolah", action: () => navigateToView("documentDetail_rkjm") });
      else attentionItems.push({ label: "Draft RKJM Belum Selesai", desc: "Lanjutkan penyusunan RKJM.", action: () => navigateToView("documentDetail_rkjm") });
    } else {
      todoSteps.push({ label: "Mulai Susun RKJM", desc: "Kerangka dasar rencana kerja sekolah.", action: () => navigateToView("rkjmPipeline"), icon: FolderOpen, color: "amber" });
    }
  }

  const rktDoc = docs.find((d: any) => d.type === "RKT");
  if (rktDoc && ["Disetujui", "Terkunci", "Diarsipkan"].includes(rktDoc.status)) {
    completedSteps.push({ label: "RKT Disetujui", desc: "Rencana Kerja Tahunan versi " + (rktDoc.version || "1.0") });
  } else if (rkjmDoc && ["Disetujui", "Terkunci", "Diarsipkan"].includes(rkjmDoc.status)) {
    if (rktDoc) {
      if (rktDoc.status === "Review") attentionItems.push({ label: "RKT Menunggu Review", desc: "Periksa catatan dari Kepala Sekolah", action: () => navigateToView("documentDetail_rkt") });
      else attentionItems.push({ label: "Draft RKT Belum Selesai", desc: "Lanjutkan penyusunan RKT.", action: () => navigateToView("documentDetail_rkt") });
    } else {
      todoSteps.push({ label: "Mulai Susun RKT", desc: "Turunkan program strategis ke Rencana Tahunan.", action: () => navigateToView("rktDerivation"), icon: FileText, color: "emerald" });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-[32px] p-8 md:p-12 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-indigo-200">
            DMS Workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Selamat Datang,
            <br />
            {settings.principal?.name || "Bapak/Ibu Kepala Sekolah"}
          </h1>
          <p className="text-indigo-100/80 text-xl font-medium mb-6">
            {settings.school.name || "Sekolah Belum Diatur"}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-indigo-200">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Tahun Pelajaran: {activeYear?.name || "-"}</span>
            </div>
            <div className="flex items-center text-indigo-200">
              <Clock className="w-4 h-4 mr-2" />
              <span>{today}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-black text-slate-800 flex items-center">
                 <Zap className="w-6 h-6 mr-3 text-indigo-500" /> Apa yang harus saya kerjakan hari ini?
               </h2>
             </div>
             {todoSteps.length > 0 ? (
               <div className="space-y-4">
                 {todoSteps.map((task, i) => (
                   <div key={i} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                     <div className={\`w-12 h-12 rounded-xl bg-\${task.color}-100 flex items-center justify-center shrink-0\`}>
                       <task.icon className={\`w-6 h-6 text-\${task.color}-600\`} />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                       <h3 className="font-bold text-slate-800 text-lg mb-1">{task.label}</h3>
                       <p className="text-slate-500 text-sm">{task.desc}</p>
                     </div>
                     <Button onClick={task.action} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">Kerjakan Sekarang</Button>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                 <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-emerald-800 mb-2">Semua Tugas Selesai!</h3>
                 <p className="text-emerald-700">Anda telah menyelesaikan semua alur perencanaan saat ini.</p>
               </div>
             )}
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-black text-slate-800 flex items-center">
                 <History className="w-6 h-6 mr-3 text-emerald-500" /> Apa yang sudah selesai?
               </h2>
             </div>
             {completedSteps.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {completedSteps.map((step, i) => (
                   <div key={i} className="flex items-center p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                     <div>
                       <p className="font-bold text-slate-700 text-sm">{step.label}</p>
                       <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-slate-500 text-sm italic text-center py-4">Belum ada tahapan yang selesai.</p>
             )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" /> Perlu Perhatian
            </h3>
            {attentionItems.length > 0 ? (
              <div className="space-y-3">
                {attentionItems.map((item, i) => (
                  <div key={i} onClick={item.action} className="p-4 rounded-xl bg-amber-50 border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors">
                    <p className="font-bold text-amber-800 text-sm mb-1">{item.label}</p>
                    <p className="text-xs text-amber-700 mb-3">{item.desc}</p>
                    <span className="text-xs font-bold text-amber-600 flex items-center">
                      Tinjau Sekarang <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                 <CheckCircle2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                 <p className="text-sm font-medium text-slate-500">Tidak ada dokumen yang memerlukan perhatian mendesak.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-4 flex items-center"><FileText className="w-4 h-4 mr-2" /> Dokumen Terakhir</h3>
             <div className="space-y-3">
               {docs.slice(0, 3).map((doc: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-200" onClick={() => navigateToView(\`documentDetail_\${doc.type.toLowerCase()}\`)}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 font-bold text-xs">{doc.type}</div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{doc.type} v{doc.version || '1.0'}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{doc.status}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                 </div>
               ))}
               {docs.length === 0 && (
                 <p className="text-xs text-slate-500 italic text-center">Belum ada dokumen yang dibuat.</p>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};`;

lines.splice(startIndex, endIndex - startIndex + 1, berandaCode);
fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
