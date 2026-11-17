import fs from 'fs';

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const headerStart = lines.findIndex(l => l.includes('<header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">'));
if (headerStart !== -1) {
  const headerEnd = lines.findIndex((l, i) => i > headerStart && l.includes('</header>'));
  
  const headerReplacement = `<header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">
          <div className="flex flex-col flex-1">
            <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span
                className="cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => setCurrentView("beranda")}
              >
                Beranda
              </span>
              {currentView !== "beranda" && (
                <>
                  <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
                  <span className="flex items-center text-indigo-600">
                    {currentView.startsWith("documentDetail_") ? (
                      <>
                        <span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span>
                        <ChevronRight className="w-3 h-3 mx-1 text-slate-300" />
                        <span>{currentView.split("_")[1].toUpperCase()}</span>
                      </>
                    ) : currentView === "dataSekolah" ? "Data Sekolah" 
                    : currentView === "analisis" ? "Analisis Sekolah"
                    : currentView === "rapor" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("analisis")}>Analisis Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Rapor Pendidikan</span></>
                    : currentView === "diagnosis" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("analisis")}>Analisis Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Analisis Prioritas</span></>
                    : currentView === "dokumenPerencanaan" ? "Dokumen Sekolah"
                    : currentView === "dokumenAdministrasi" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Administrasi</span></>
                    : currentView === "monitoring" ? "Pelaksanaan & Monitoring"
                    : currentView === "pengaturan" ? "Pengaturan"
                    : currentView === "rkjmPipeline" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Penyusunan RKJM</span></>
                    : currentView === "rktDerivation" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Penyusunan RKT</span></>
                    : currentView === "rkasDerivation" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Penyusunan RKAS</span></>
                    : currentView === "kspStudio" ? <><span className="cursor-pointer hover:text-indigo-800 transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-slate-300" /><span>Penyusunan KSP</span></>
                    : "Tampuyak OS"
                    }
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari dokumen, nomor, program, tahun..." 
              className="w-full bg-slate-100/50 border border-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400">⌘K</div>
          </div>

          <div className="flex items-center space-x-3 flex-1 justify-end">
            <div className="hidden md:block text-right mr-2">
              <p className="text-xs font-bold text-slate-800">
                {settings.school.name || "Nama Sekolah"}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                Tahun {settings.academicYears?.find((y: any) => y.isActive)?.name || "2024/2025"}
              </p>
            </div>
            <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              {docs.some((d: any) => d.status === "Review" || d.status === "Perlu Revisi") && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              )}
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:shadow-md transition-all">
              KS
            </div>
          </div>
        </header>`;

  lines.splice(headerStart, headerEnd - headerStart + 1, headerReplacement);
  fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
}
