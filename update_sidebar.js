const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
const searchString = `<button
            onClick={() => setCurrentView("dokumenPerencanaan")}
            className={\`enterprise-sidebar-item \${["dokumenPerencanaan", "rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kspStudio", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "active" : ""}\`}
          >
            <FolderOpen
              className="enterprise-sidebar-icon"
            />
            Dokumen
          </button>`;

const replaceString = `<div className="space-y-1">
            <button
              onClick={() => setCurrentView("dokumenPerencanaan")}
              className={\`enterprise-sidebar-item \${["dokumenPerencanaan", "rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kspStudio", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "active" : ""}\`}
            >
              <FolderOpen className="enterprise-sidebar-icon" />
              Dokumen Perencanaan
            </button>
            <div className="pl-9 space-y-1">
              <button
                onClick={() => setCurrentView("kspStudio")}
                className={\`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors \${currentView === "kspStudio" ? "bg-blue-50 text-blue-700" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}\`}
              >
                Kurikulum Satuan Pendidikan (KSP)
              </button>
              <button
                onClick={() => setCurrentView("rkjmPipeline")}
                className={\`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors \${["rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator"].includes(currentView) ? "bg-blue-50 text-blue-700" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}\`}
              >
                RKJM
              </button>
              <button
                onClick={() => setCurrentView("rktDerivation")}
                className={\`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors \${currentView === "rktDerivation" ? "bg-blue-50 text-blue-700" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}\`}
              >
                RKT
              </button>
              <button
                onClick={() => setCurrentView("rkasDerivation")}
                className={\`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors \${currentView === "rkasDerivation" ? "bg-blue-50 text-blue-700" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}\`}
              >
                RKAS
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors text-[var(--color-eds-text-secondary)] opacity-50 cursor-not-allowed"
              >
                Kalender Pendidikan
              </button>
            </div>
          </div>`;

if (code.includes(searchString)) {
  code = code.replace(searchString, replaceString);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Replaced sidebar.");
} else {
  console.log("Could not find sidebar search string.");
}
