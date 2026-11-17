const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const stepperCode = `
const ProcessStepper = ({ currentView, settings }: any) => {
  const docs = settings.documents || [];
  const steps = [
    { id: "data", label: "Data Sekolah", views: ["dataSekolah"], isDone: settings.school?.name !== "" },
    { id: "analisis", label: "Analisis", views: ["analisis", "rapor", "diagnosis", "targetEngine"], isDone: settings.rapor?.isLocked },
    { id: "rkjm", label: "RKJM", views: ["rkjmPipeline", "rkjmBlueprint", "rkjmOrchestrator"], isDone: docs.some((d: any) => d.type === "RKJM") },
    { id: "rkt", label: "RKT", views: ["rktDerivation"], isDone: docs.some((d: any) => d.type === "RKT") },
    { id: "rkas", label: "RKAS", views: ["rkasDerivation"], isDone: docs.some((d: any) => d.type === "RKAS") },
    { id: "pelaksanaan", label: "Pelaksanaan", views: [], isDone: false },
    { id: "monitoring", label: "Monitoring", views: ["monitoring"], isDone: false },
    { id: "selesai", label: "Selesai", views: ["publishingCenter"], isDone: false },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-4 mb-6">
      {steps.map((step, idx) => {
        const isActive = step.views.includes(currentView);
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className={\`flex items-center px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all \${isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : step.isDone ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-white text-slate-400 border border-slate-200"}\`}>
              {step.isDone && !isActive && <Check className="w-3.5 h-3.5 mr-1.5" />}
              {step.label}
            </div>
            {idx < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
          </div>
        )
      })}
    </div>
  )
}

const LayoutContainer = () => {`;

code = code.replace(/const LayoutContainer = \(\) => {/, stepperCode);

code = code.replace(
  /<div className="max-w-\[1300px\] mx-auto h-full">/,
  '<div className="max-w-[1300px] mx-auto h-full">\n            {currentView !== "beranda" && currentView !== "pengaturan" && <ProcessStepper currentView={currentView} settings={settings} />}\n'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done fixing stepper');
