import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// We will inject the Penyusunan tab state and tab definition back into RKJMPipelineView
const stateToInject = `
  // Penyusunan Pipeline State
  const [activeStep, setActiveStep] = useState(0);
  const progressPercent = Math.round((activeStep / (RKJMPipelineEngine.Steps.length - 1)) * 100) || 0;
  const currentStepData = RKJMPipelineEngine.Steps[activeStep];
  
  const handleNextStep = () => {
    if (activeStep < RKJMPipelineEngine.Steps.length - 1) setActiveStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };
`;

code = code.replace(
  `// Lifecycle states (moved to upper management layer conceptually)`,
  stateToInject
);

const tabsReplacement = `  const tabs = [
    { id: "penyusunan", label: "Penyusunan", icon: GitCommit },
    { id: "pratinjau", label: "Preview", icon: FileText },
    { id: "review", label: "Review", icon: CheckCircle2 },
    { id: "bandingkan", label: "Bandingkan Versi", icon: GitCompare },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "cetak", label: "Cetak & Ekspor", icon: Printer },
    { id: "arsipkan", label: "Arsipkan", icon: Archive },
  ];`;

code = code.replace(
  `  const tabs = [
    { id: "pratinjau", label: "Preview", icon: FileText },
    { id: "review", label: "Review", icon: CheckCircle2 },
    { id: "bandingkan", label: "Bandingkan Versi", icon: GitCompare },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "cetak", label: "Cetak & Ekspor", icon: Printer },
    { id: "arsipkan", label: "Arsipkan", icon: Archive },
  ];`,
  tabsReplacement
);

// We need to inject the activeTab === "penyusunan" JSX back into the component.
// We will place it right before {activeTab === "pratinjau" && (
const penyusunanJSX = `
      {activeTab === "penyusunan" && (
        <Card title="Status Pipeline Penyusunan" icon={GitCommit} description="Proses di balik layar untuk merakit RKJM.">
           <div className="mb-8">
             <div className="flex justify-between items-center mb-2">
               <span className="text-sm font-bold text-slate-600">
                 Progress Perakitan
               </span>
               <span className="text-sm font-bold text-indigo-600">
                 Langkah {activeStep + 1} dari {RKJMPipelineEngine.Steps.length}
               </span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-3">
               <div
                 className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                 style={{ width: \`\${progressPercent}%\` }}
               ></div>
             </div>
           </div>

           <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
             <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
                {currentStepData.title}
             </h3>
             <p className="text-slate-600 mb-6">{currentStepData.description}</p>
             <div className="space-y-3 mb-8">
               {currentStepData.actions.map((act, i) => (
                 <div key={i} className="flex items-center text-sm font-medium text-slate-700 bg-white border border-slate-200 p-3 rounded-xl">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3" />
                   {act}
                 </div>
               ))}
             </div>
             <div className="flex justify-between border-t border-slate-200 pt-6">
               <Button variant="outline" onClick={handlePrevStep} disabled={activeStep === 0}>Sebelumnya</Button>
               {activeStep === RKJMPipelineEngine.Steps.length - 1 ? (
                 <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setActiveTab("pratinjau")}>Selesai & Pratinjau</Button>
               ) : (
                 <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleNextStep}>Langkah Selanjutnya</Button>
               )}
             </div>
           </div>
        </Card>
      )}
`;

code = code.replace(
  `{activeTab === "pratinjau" && (`,
  penyusunanJSX + '\n      {activeTab === "pratinjau" && ('
);

fs.writeFileSync('src/Tampuyak.tsx', code);
