const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const targetBeranda = `const BerandaView = ({ navigateToView, navigateToSettings }: any) => {
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
      todoSteps.push({ label: "Mulai Susun RKT", desc: "Jabarkan RKJM menjadi rencana satu tahun.", action: () => navigateToView("rktDerivation"), icon: FolderOpen, color: "blue" });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-[32px] p-8 md:p-12 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-indigo-200">
            <Calendar className="w-3.5 h-3.5 mr-2" /> {today}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Selamat Datang di Workspace,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">{settings.school.name || "Sekolah Belum Diatur"}</span>
          </h1>
          <p className="text-indigo-100/80 text-lg max-w-2xl leading-relaxed">
            Tahun Ajaran Aktif: <span className="font-bold text-white bg-indigo-500/30 px-2 py-0.5 rounded ml-1">{activeYear?.name || "Belum diatur"} (Semester {activeYear?.semester || "Ganjil"})</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100px] opacity-50 -z-0"></div>
             <div className="relative z-10">
               <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                 <ListTodo className="w-6 h-6 mr-3 text-indigo-500" />
                 Fokus Hari Ini
               </h2>
               
               {attentionItems.length > 0 && (
                 <div className="mb-6 space-y-3">
                   <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">Perlu Perhatian</h3>
                   {attentionItems.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl cursor-pointer hover:border-rose-300 transition-colors" onClick={item.action}>
                       <div className="flex items-center">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 mr-4 shadow-sm">
                           <AlertCircle className="w-5 h-5" />
                         </div>
                         <div>
                           <h4 className="font-bold text-rose-900">{item.label}</h4>
                           <p className="text-sm text-rose-700 mt-0.5">{item.desc}</p>
                         </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-rose-400" />
                     </div>
                   ))}
                 </div>
               )}

               <div className="space-y-3">
                 <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Daftar Tugas</h3>
                 {todoSteps.map((step, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all group" onClick={step.action}>
                     <div className="flex items-center">
                       <div className={\`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-\${step.color}-500 mr-4 shadow-sm border border-slate-100 group-hover:border-\${step.color}-200 transition-colors\`}>
                         <step.icon className="w-5 h-5" />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{step.label}</h4>
                         <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
                       </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                   </div>
                 ))}
                 
                 {todoSteps.length === 0 && attentionItems.length === 0 && (
                   <div className="text-center p-8 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50">
                     <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                       <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <h4 className="font-bold text-emerald-800">Semua Tugas Selesai</h4>
                     <p className="text-sm text-emerald-600 mt-1">Sistem dalam kondisi optimal. Tidak ada aksi mendesak saat ini.</p>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
             <h3 className="font-black text-slate-800 mb-4">Progres Penyelesaian</h3>
             <div className="space-y-4">
               {completedSteps.map((step, idx) => (
                 <div key={idx} className="flex items-start">
                   <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                     <Check className="w-3 h-3 font-bold" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-700 text-sm">{step.label}</h4>
                     <p className="text-xs text-slate-500">{step.desc}</p>
                   </div>
                 </div>
               ))}
               {completedSteps.length === 0 && (
                 <p className="text-slate-500 text-sm italic text-center py-4">Belum ada tahapan yang selesai.</p>
               )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
             <h3 className="font-black text-slate-800 mb-4 flex items-center justify-between">
               <span>Akses Cepat</span>
               <Link className="w-4 h-4 text-slate-400" />
             </h3>
             <div className="space-y-2">
               {docs.map((doc: any) => (
                 <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition-colors" onClick={() => navigateToView(\`documentDetail_\${doc.type.toLowerCase()}\`)}>
                   <div className="flex items-center text-sm">
                     <FileText className="w-4 h-4 text-indigo-500 mr-3" />
                     <span className="font-bold text-slate-700">{doc.type}</span>
                   </div>
                   <div className="flex items-center">
                     <span className={\`text-[10px] uppercase font-bold px-2 py-0.5 rounded border \${doc.status === "Disetujui" || doc.status === "Terkunci" || doc.status === "Diarsipkan" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : doc.status === "Review" ? "bg-blue-50 text-blue-600 border-blue-200" : doc.status === "Draft" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-slate-50 text-slate-500 border-slate-200"}\`}>{doc.status}</span>
                   </div>
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

const newBeranda = `const BerandaView = ({ navigateToView, navigateToSettings }: any) => {
  const { settings } = useApp();
  
  const activeYear = settings.academicYears?.find((y: any) => y.isActive);
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const docs = settings.documents || [];

  // SMART CHECKLIST Logics
  const getProfileStatus = () => settings.school?.name && settings.school?.npsn ? "Complete" : settings.school?.name ? "Incomplete" : "Missing";
  const getTeachersStatus = () => settings.guru?.length > 5 ? "Complete" : settings.guru?.length > 0 ? "Incomplete" : "Missing";
  const getStudentsStatus = () => settings.pesertaDidik?.total > 0 ? "Complete" : "Missing";
  const getFacilitiesStatus = () => Object.keys(settings.sarpras || {}).length > 2 ? "Complete" : "Missing";
  const getReportStatus = () => settings.rapor?.isLocked ? "Complete" : settings.rapor?.data ? "Incomplete" : "Missing";
  const getPlanningStatus = () => docs.length > 0 ? "Complete" : "Missing";

  const checklist = [
    { label: "Profil Sekolah", status: getProfileStatus(), action: () => navigateToSettings("school"), icon: Building2 },
    { label: "Guru", status: getTeachersStatus(), action: () => navigateToSettings("guru"), icon: Users },
    { label: "Siswa", status: getStudentsStatus(), action: () => navigateToSettings("pesertaDidik"), icon: Users },
    { label: "Sarana Prasarana", status: getFacilitiesStatus(), action: () => navigateToSettings("sarpras"), icon: Home },
    { label: "Rapor Pendidikan", status: getReportStatus(), action: () => navigateToView("rapor"), icon: BarChart3 },
    { label: "Perencanaan (RKJM)", status: getPlanningStatus(), action: () => navigateToView("rkjmPipeline"), icon: FolderOpen },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "Complete") return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-200">Lengkap</span>;
    if (status === "Incomplete") return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-200">Belum Lengkap</span>;
    return <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">Kosong</span>;
  };

  const rkjmDoc = docs.find((d: any) => d.type === "RKJM");
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-[32px] p-8 md:p-12 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-60"></div>
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-indigo-200">
            <Calendar className="w-3.5 h-3.5 mr-2" /> {today}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Selamat Datang,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">{settings.school?.name || "Sekolah Belum Diatur"}</span>
          </h1>
          <p className="text-indigo-100/80 text-lg max-w-2xl leading-relaxed">
            Tahun Ajaran Aktif: <span className="font-bold text-white bg-indigo-500/30 px-2 py-0.5 rounded ml-1">{activeYear?.name || "Belum diatur"} (Semester {activeYear?.semester || "Ganjil"})</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
             <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
               <CheckCircle2 className="w-6 h-6 mr-3 text-indigo-500" />
               Smart Checklist Data Sekolah
             </h2>
             <div className="space-y-3">
               {checklist.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all group" onClick={item.action}>
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 mr-4 shadow-sm border border-slate-100 group-hover:text-indigo-600 transition-colors">
                       <item.icon className="w-5 h-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{item.label}</h4>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <StatusBadge status={item.status} />
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {!rkjmDoc ? (
            <div className="bg-gradient-to-b from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 shadow-sm text-center flex flex-col justify-center h-full">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-800 mb-3 text-xl">Dokumen Pertama Anda</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Belum ada RKJM yang dibuat. Gunakan Template Resmi RKJM untuk memulai perencanaan jangka menengah sekolah Anda.
              </p>
              <div className="bg-white border border-indigo-100 rounded-xl p-3 mb-6 inline-block mx-auto">
                <p className="text-xs font-bold text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1.5" /> Estimasi: 30 menit
                </p>
              </div>
              <Button onClick={() => navigateToView("rkjmPipeline")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-md shadow-indigo-500/20">
                Mulai RKJM
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center flex flex-col justify-center h-full">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-800 mb-2 text-xl">Fokus Hari Ini</h3>
              <p className="text-slate-600 mb-6 text-sm">Anda telah memulai perencanaan. Lanjutkan penyusunan dan lengkapi indikator untuk merealisasikan tujuan.</p>
              <Button onClick={() => navigateToView("dokumenPerencanaan")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-md shadow-indigo-500/20">
                Buka Dokumen Sekolah
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};`;

code = code.replace(targetBeranda, newBeranda);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
