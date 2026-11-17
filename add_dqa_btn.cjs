const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const searchMenuStr = `          <button
            onClick={() => setCurrentView("dokumenPerencanaan")}
            className={\`w-full flex items-center px-3 py-2.5 rounded-lg text-[14px] font-bold transition-all duration-300 \${["dokumenPerencanaan", "rkjmPipeline", "rkjmBlueprint", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kspStudio", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"}\`}
          >
            <FolderOpen
              className={\`w-5 h-5 mr-3.5 \${["dokumenPerencanaan", "rkjmPipeline", "rkjmBlueprint", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kspStudio", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "text-slate-400" : "text-slate-500"}\`}
            />
            Dokumen
          </button>`;

const replacement = searchMenuStr + `\n
          <button
            onClick={() => setCurrentView("dqaEngine")}
            className={\`w-full flex items-center px-3 py-2.5 rounded-lg text-[14px] font-bold transition-all duration-300 \${currentView === "dqaEngine" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-emerald-700 hover:bg-emerald-50"}\`}
          >
            <ShieldCheck
              className={\`w-5 h-5 mr-3.5 \${currentView === "dqaEngine" ? "text-emerald-300" : "text-emerald-600"}\`}
            />
            Sertifikasi Mutu
          </button>`;

if (code.includes(searchMenuStr)) {
  code = code.replace(searchMenuStr, replacement);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Added Sertifikasi Mutu button to sidebar");
} else {
  console.log("Could not find the sidebar Dokumen menu block");
}
