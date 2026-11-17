const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/Tampuyak.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('activeMode === "settings"')) {
  // Add EnterpriseWorkspaceShell rendering inside KSPStudioView
  const settingsMode = `
  if (activeMode === "settings") {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-8 -mb-8 overflow-hidden bg-[var(--color-eds-bg)] relative animate-in fade-in slide-in-from-right-8 duration-300">
         <EnterpriseWorkspaceShell onClose={() => navigateToView("kspStudio")} />
      </div>
    );
  }
  `;
  
  content = content.replace(
    '  if (activeMode === "attachments") {',
    settingsMode + '\n  if (activeMode === "attachments") {'
  );

  content = content.replace(
    /onOpenAttachments=\{\(\) => navigateToView\("kspStudio_attachments"\)\}/,
    `onOpenAttachments={() => navigateToView("kspStudio_attachments")} \n      onOpenSettings={() => navigateToView("kspStudio_settings")}`
  );
  
  // Add KSP Settings to the sidebar
  const kspSettingsSidebar = `
                    <button
                      onClick={() => setCurrentView("kspStudio_settings")}
                      className={\`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors \${currentView === "kspStudio_settings" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}\`}
                    >
                      ⚙️ Workspace
                    </button>
  `;
  
  content = content.replace(
    /<button\s*className="w-full text-left px-3 py-1\.5 text-xs font-bold rounded-md transition-colors text-slate-400 cursor-not-allowed"\s*>\s*📄 Publish\s*<\/button>/,
    kspSettingsSidebar + '\n                    <button\n                      className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors text-slate-400 cursor-not-allowed"\n                    >\n                      📄 Publish\n                    </button>'
  );
  
  fs.writeFileSync(file, content);
  console.log("Patched Tampuyak.tsx");
}
