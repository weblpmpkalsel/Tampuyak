const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  `if (activeMode === "preview") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
         <KspPreviewWorkspace onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }`,
  `if (activeMode === "preview") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <KspPreviewWorkspace onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }`
);

code = code.replace(
  `if (activeMode === "validation") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
         <KSPValidationPanel onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }`,
  `if (activeMode === "validation") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <KSPValidationPanel onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }`
);

code = code.replace(
  `if (activeMode === "attachments") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative">
         <KSPAttachmentPanel onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }`,
  `if (activeMode === "attachments") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <KSPAttachmentPanel onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }`
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Updated Panel Animations");
