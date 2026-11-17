import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const globalStepperCode = `
const GlobalWorkflowStepper = ({ currentView, settings, navigateToView }: any) => {
  const docs = settings?.documents || [];
  
  const steps = [
    { id: "dataSekolah", label: "Data Sekolah", check: () => settings?.school?.name !== "" },
    { id: "rapor", label: "Rapor Pendidikan", check: () => settings?.rapor?.isLocked },
    { id: "diagnosis", label: "Analisis Prioritas", check: () => settings?.diagnosis?.isLocked },
    { id: "rkjm", label: "RKJM", check: () => docs.some((d: any) => d.type === "RKJM" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkt", label: "RKT", check: () => docs.some((d: any) => d.type === "RKT" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "rkas", label: "RKAS", check: () => docs.some((d: any) => d.type === "RKAS" && ["Disetujui", "Terkunci", "Diarsipkan", "Siap Dicetak", "Final"].includes(d.status)) },
    { id: "monitoring", label: "Monitoring", check: () => false },
  ];

  let currentStepIndex = steps.findIndex(s => !s.check());
  if (currentStepIndex === -1) currentStepIndex = steps.length - 1;

  // Let's determine if we are in a planning view to show this
  const planningViews = ["dataSekolah", "rapor", "diagnosis", "analisis", "rkjmPipeline", "rktDerivation", "rkasDerivation", "monitoring", "kspStudio", "dokumenPerencanaan"];
  
  const viewMap: any = {
    "dataSekolah": "dataSekolah",
    "rapor": "rapor",
    "diagnosis": "diagnosis",
    "analisis": "diagnosis",
    "rkjmPipeline": "rkjm",
    "documentDetail_rkjm": "rkjm",
    "rktDerivation": "rkt",
    "documentDetail_rkt": "rkt",
    "rkasDerivation": "rkas",
    "documentDetail_rkas": "rkas",
    "monitoring": "monitoring",
    "kspStudio": "rkt", // Arbitrary
    "documentDetail_ksp": "rkt",
  };

  const activeId = viewMap[currentView] || "dataSekolah";
  
  if (!planningViews.includes(currentView) && !currentView.startsWith("documentDetail_")) return null;

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 overflow-x-auto sticky top-20 z-10 shadow-sm">
       <div className="flex items-center space-x-2 min-w-max text-sm">
         {steps.map((step, idx) => {
           const isCompleted = step.check();
           const isActive = step.id === activeId;
           
           return (
             <div key={step.id} className="flex items-center">
               <div 
                 onClick={() => {
                   if (step.id === "rkjm") navigateToView("documentDetail_rkjm");
                   else if (step.id === "rkt") navigateToView("documentDetail_rkt");
                   else if (step.id === "rkas") navigateToView("documentDetail_rkas");
                   else navigateToView(step.id);
                 }}
                 className={\`flex items-center px-3 py-1.5 rounded-full cursor-pointer transition-all border \${isActive ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-100' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 font-medium'}\`}
               >
                 {isCompleted && !isActive ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : isActive ? <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></div>}
                 {step.label}
               </div>
               {idx < steps.length - 1 && (
                 <ChevronRight className={\`w-4 h-4 mx-2 \${isCompleted ? 'text-emerald-300' : 'text-slate-300'}\`} />
               )}
             </div>
           );
         })}
       </div>
    </div>
  );
};
`;

const importRegex = /const LayoutContainer = \(\) => {/;
code = code.replace(importRegex, globalStepperCode + '\nconst LayoutContainer = () => {');

// Inject the stepper right after the header
const headerRegex = /<\/header>/;
code = code.replace(headerRegex, '</header>\n        <GlobalWorkflowStepper currentView={currentView} settings={settings} navigateToView={setCurrentView} />');

fs.writeFileSync('src/Tampuyak.tsx', code);
