const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  `: currentView === "kspStudio" ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Penyusunan KSP</span></>`,
  `: currentView.startsWith("kspStudio") ? <><span className="cursor-pointer hover:text-[var(--color-eds-primary)] font-bold transition-colors" onClick={() => setCurrentView("dokumenPerencanaan")}>Dokumen Sekolah</span><ChevronRight className="w-3 h-3 mx-1 text-[var(--color-eds-text-secondary)]" /><span>Penyusunan KSP</span></>`
);

code = code.replace(
  `className={\`enterprise-sidebar-item \${["dokumenPerencanaan", "rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kspStudio", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "active" : ""}\`}`,
  `className={\`enterprise-sidebar-item \${["dokumenPerencanaan", "rkjmPipeline", "rkjmKerangka", "rkjmOrchestrator", "rktDerivation", "rkasDerivation", "kspStudio", "kspStudio_preview", "kspStudio_validation", "kspStudio_attachments", "documentEditor", "publishingCenter", "dqaEngine"].includes(currentView) ? "active" : ""}\`}`
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Updated Breadcrumbs");
