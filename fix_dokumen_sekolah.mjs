import fs from 'fs';

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('const DokumenPerencanaanView = '));
let braces = 0;
let started = false;
let end = -1;
for (let i = start; i < lines.length; i++) {
  if (lines[i].includes('{')) braces += (lines[i].match(/\{/g) || []).length;
  if (lines[i].includes('}')) braces -= (lines[i].match(/\}/g) || []).length;
  if (braces > 0) started = true;
  if (started && braces === 0) {
    end = i;
    break;
  }
}

const replacement = `const DokumenPerencanaanView = ({ navigateToView }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const officialDocs = [
    {
      id: "rkjm",
      title: "RKJM",
      subtitle: "Rencana Kerja Jangka Menengah (4 Tahun)",
      status: "Draft",
      version: "1.2",
      lastChanged: "12 Juni 2026",
      actionLabel: "Buka",
      actionTarget: "rkjmPipeline",
      color: "indigo"
    },
    {
      id: "rkt",
      title: "RKT",
      subtitle: "Rencana Kerja Tahunan (1 Tahun)",
      status: "Review",
      version: "1.0",
      lastChanged: "15 Juni 2026",
      actionLabel: "Buka",
      actionTarget: "rktDerivation",
      color: "blue"
    },
    {
      id: "rkas",
      title: "RKAS",
      subtitle: "Rencana Kegiatan dan Anggaran Sekolah",
      status: "Belum Dibuat",
      version: "-",
      lastChanged: "-",
      actionLabel: "Buat",
      actionTarget: "rkasDerivation",
      color: "emerald"
    },
    {
      id: "ksp",
      title: "KSP",
      subtitle: "Kurikulum Operasional Satuan Pendidikan",
      status: "Disetujui",
      version: "2.0",
      lastChanged: "10 Juni 2026",
      actionLabel: "Buka",
      actionTarget: "kspStudio",
      color: "purple"
    }
  ];

  const recentDocs = [officialDocs[0], officialDocs[1]];
  const pinnedDocs = [officialDocs[3]];

  const filteredDocs = officialDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "Semua" || doc.status.includes(filterStatus);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2">
              Dokumen Sekolah
            </h1>
            <p className="text-slate-500 font-medium">
              Manajemen Dokumen Resmi Sekolah (DMS)
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari dokumen, nomor, atau status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex gap-2">
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium text-sm text-slate-600 bg-white"
             >
               <option value="Semua">Semua Status</option>
               <option value="Draft">Draft</option>
               <option value="Review">Review</option>
               <option value="Disetujui">Disetujui</option>
               <option value="Belum Dibuat">Belum Dibuat</option>
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center px-2">
             <Star className="w-5 h-5 mr-2 text-amber-500" /> Dokumen Dipin
          </h2>
          {pinnedDocs.map(doc => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                 <div className={\`w-10 h-10 rounded-xl bg-\${doc.color}-50 flex items-center justify-center\`}>
                   <FileText className={\`w-5 h-5 text-\${doc.color}-500\`} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800">{doc.title}</h3>
                   <p className="text-xs text-slate-500">{doc.status} • Versi {doc.version}</p>
                 </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigateToView(doc.actionTarget)}>
                 Buka
              </Button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center px-2">
             <History className="w-5 h-5 mr-2 text-blue-500" /> Terakhir Diakses
          </h2>
          {recentDocs.map(doc => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                 <div className={\`w-10 h-10 rounded-xl bg-\${doc.color}-50 flex items-center justify-center\`}>
                   <FileText className={\`w-5 h-5 text-\${doc.color}-500\`} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800">{doc.title}</h3>
                   <p className="text-xs text-slate-500">{doc.status} • {doc.lastChanged}</p>
                 </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigateToView(doc.actionTarget)}>
                 Buka
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h2 className="text-xl font-black text-slate-800 px-2">Semua Dokumen Resmi</h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={\`w-12 h-12 rounded-xl bg-\${doc.color}-50 flex items-center justify-center shrink-0\`}
                >
                  <FileText className={\`w-6 h-6 text-\${doc.color}-500\`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{doc.subtitle}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span
                      className={\`px-2.5 py-1 font-bold rounded-md \${doc.status === "Draft" ? "bg-amber-100 text-amber-800" : doc.status === "Review" ? "bg-blue-100 text-blue-800" : doc.status === "Disetujui" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}\`}
                    >
                      Status: {doc.status}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-600">Versi: {doc.version}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-600">Diubah: {doc.lastChanged}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <Button
                  onClick={() => navigateToView(doc.actionTarget)}
                  className="w-full md:w-auto"
                  variant={doc.status === "Belum Dibuat" ? "default" : "outline"}
                >
                  {doc.actionLabel}
                </Button>
              </div>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <p className="text-slate-500 font-medium">Tidak ada dokumen yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};`;

lines.splice(start, end - start + 1, replacement);
fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
