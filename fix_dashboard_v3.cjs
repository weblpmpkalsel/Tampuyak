const fs = require("fs");

let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

const startIndex = content.indexOf("const DashboardView = ({ navigateToSettings, navigateToView }: any) => {");
if (startIndex === -1) {
    console.log("DashboardView start not found");
    process.exit(1);
}

const returnIndex = content.indexOf("return (", startIndex);
const endIndex = content.indexOf("};", returnIndex);

if (endIndex === -1) {
    console.log("DashboardView end not found");
    process.exit(1);
}

const before = content.substring(0, returnIndex);
const after = content.substring(endIndex);

const newReturnBlock = `return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border-t-[6px] border-indigo-700 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 border-x border-b border-slate-200">
        <div className="flex-1">
          <div className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded text-xs font-bold tracking-wide uppercase mb-4">
            Ringkasan Eksekutif
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
            {SchoolName}
          </h1>
          <p className="text-slate-600 text-lg mb-6 font-medium">
            Tahun Pelajaran: <span className="font-bold text-slate-800">{getActiveAcademicYear()}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigateToSettings("school")}
              className="bg-indigo-700 text-white hover:bg-indigo-800 font-semibold rounded px-5 py-2.5 shadow-sm text-sm"
            >
              Lengkapi Data
            </Button>
            <Button
              onClick={() => navigateToView("rkjmPipeline")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded px-5 py-2.5 text-sm bg-white"
            >
              Buka RKJM
            </Button>
            <Button
              onClick={() => navigateToView("rktDerivation")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded px-5 py-2.5 text-sm bg-white"
            >
              Buka RKT
            </Button>
            <Button
              onClick={() => navigateToView("rkasDerivation")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded px-5 py-2.5 text-sm bg-white"
            >
              Buka RKAS
            </Button>
            <Button
              onClick={() => navigateToView("monitoring")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded px-5 py-2.5 text-sm bg-white"
            >
              Monitoring
            </Button>
            <Button
              onClick={() => navigateToView("documentEditor")}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded px-5 py-2.5 text-sm bg-white"
            >
              Cetak Dokumen
            </Button>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-center w-full md:w-72 shrink-0 cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-colors" onClick={() => navigateToView("governance")}>
          <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Kesehatan Sekolah
          </p>
          <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 absolute inset-0"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  healthScore >= 80
                    ? "#059669"
                    : healthScore >= 50
                      ? "#d97706"
                      : "#e11d48"
                }
                strokeWidth="4"
                strokeDasharray={\`\${healthScore}, 100\`}
              />
            </svg>
            <span className="text-4xl font-bold text-slate-900">{healthScore}</span>
          </div>
          <div
            className={\`inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wide border \${healthScore >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : healthScore >= 50 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'}\`}
          >
            {healthCategory}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group p-6"
          onClick={() => navigateToView("dokumenPerencanaan")}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-indigo-800 transition-colors">
                Status Perencanaan
              </h3>
              <FileText className="w-5 h-5 text-indigo-700" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">RKJM</span>
                <span className={\`font-semibold \${rkjmStatus === 'Disetujui' ? 'text-emerald-700' : 'text-slate-600'}\`}>{rkjmStatus}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">RKT</span>
                <span className={\`font-semibold \${rktStatus === 'Disetujui' ? 'text-emerald-700' : 'text-slate-600'}\`}>{rktStatus}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">RKAS</span>
                <span className={\`font-semibold \${getDocStatus('RKAS') === 'Disetujui' ? 'text-emerald-700' : 'text-slate-600'}\`}>{getDocStatus('RKAS')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">Monitoring</span>
                <span className="font-semibold text-emerald-700">Berjalan</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group p-6"
          onClick={() => navigateToView("governance")}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-emerald-800 transition-colors">
                Indikator Master
              </h3>
              <Target className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="flex items-baseline gap-2 mb-4 mt-4">
              <span className="text-4xl font-bold text-slate-900">{readiness.score}%</span>
              <span className="text-sm font-semibold text-slate-600">
                Terisi
              </span>
            </div>
            <div className="text-sm font-medium text-slate-600 leading-relaxed">
              Periksa kelengkapan di menu Data Master & Governance.
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Tindakan Diperlukan
            </h3>
            {notifications.length > 0 && (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded border border-rose-200">
                {notifications.length} Perhatian
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto max-h-[220px]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-700 font-medium h-full flex flex-col justify-center items-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-3" />
                <p>Semua berjalan lancar.</p>
                <p className="text-sm text-slate-500 font-normal">Tidak ada peringatan khusus saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {notifications.map((notif, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={notif.action}
                  >
                    <div
                      className={\`w-10 h-10 rounded flex items-center justify-center shrink-0 border \${notif.type === 'danger' ? 'bg-rose-50 text-rose-800 border-rose-200' : notif.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200'}\`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-800 transition-colors">
                        {notif.title}
                      </h4>
                      <p className="text-sm font-medium text-slate-600 mt-1">
                        {notif.desc}
                      </p>
                    </div>
                    <div className="text-slate-400 flex items-center group-hover:text-indigo-700 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
`;

fs.writeFileSync("src/Tampuyak.tsx", before + newReturnBlock + after);
console.log("Successfully replaced DashboardView return block");
