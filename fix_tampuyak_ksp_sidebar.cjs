const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldSidebar = `<div className="pl-9 space-y-1">
              <button
                onClick={() => setCurrentView("kspStudio")}
                className={\`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors \${currentView === "kspStudio" ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}\`}
              >
                Kurikulum Satuan Pendidikan (KSP)
              </button>`;

const newSidebar = `<div className="pl-9 space-y-1">
              <div>
                <button
                  onClick={() => setCurrentView("kspStudio")}
                  className={\`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center \${currentView.startsWith("kspStudio") ? "bg-blue-50 text-[var(--color-eds-primary)]" : "text-[var(--color-eds-text-secondary)] hover:bg-slate-100 hover:text-slate-900"}\`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  KSP
                </button>
                {currentView.startsWith("kspStudio") && (
                  <div className="pl-6 mt-1 space-y-1 border-l-2 border-blue-100 ml-4 mb-2">
                    <button
                      onClick={() => setCurrentView("kspStudio")}
                      className={\`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors \${currentView === "kspStudio" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}\`}
                    >
                      🏠 Home
                    </button>
                    <button
                      onClick={() => setCurrentView("kspStudio_preview")}
                      className={\`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors \${currentView === "kspStudio_preview" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}\`}
                    >
                      👁 Preview
                    </button>
                    <button
                      onClick={() => setCurrentView("kspStudio_validation")}
                      className={\`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors \${currentView === "kspStudio_validation" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}\`}
                    >
                      📋 Validation
                    </button>
                    <button
                      onClick={() => setCurrentView("kspStudio_attachments")}
                      className={\`w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors \${currentView === "kspStudio_attachments" ? "text-blue-700 bg-white shadow-sm border border-blue-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}\`}
                    >
                      📎 Attachments
                    </button>
                    <button
                      className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-md transition-colors text-slate-400 cursor-not-allowed"
                    >
                      📄 Publish
                    </button>
                  </div>
                )}
              </div>`;

if (code.includes(oldSidebar)) {
  code = code.replace(oldSidebar, newSidebar);
}

// Update KSPStudioView signature
const oldKspStudioView = `const KSPStudioView = ({ navigateToView }: any) => {
  const { settings } = useApp();
  const [activeMode, setActiveMode] = useState<"home" | "preview" | "validation" | "attachments">("home");`;

const newKspStudioView = `const KSPStudioView = ({ navigateToView, activeMode = "home" }: any) => {
  const { settings } = useApp();`;

if (code.includes(oldKspStudioView)) {
  code = code.replace(oldKspStudioView, newKspStudioView);
  
  // also replace set activeMode stuff
  code = code.replace(/setActiveMode\("home"\)/g, `navigateToView("kspStudio")`);
  code = code.replace(/setActiveMode\("preview"\)/g, `navigateToView("kspStudio_preview")`);
  code = code.replace(/setActiveMode\("validation"\)/g, `navigateToView("kspStudio_validation")`);
  code = code.replace(/setActiveMode\("attachments"\)/g, `navigateToView("kspStudio_attachments")`);
}

// Update main renderer
code = code.replace(`            {currentView === "kspStudio" && (
              <KSPStudioView navigateToView={setCurrentView} />
            )}`, `{currentView.startsWith("kspStudio") && (
              <KSPStudioView navigateToView={setCurrentView} activeMode={currentView === "kspStudio" ? "home" : currentView.split("_")[1]} />
            )}`);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Updated Tampuyak.tsx");
