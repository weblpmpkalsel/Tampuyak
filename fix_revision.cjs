const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldBtn = `                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => {
                  setShowImpactAnalysis(false);
                  navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline");
                }}>Lanjutkan Revisi</Button>`;

const newBtn = `                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => {
                  setShowImpactAnalysis(false);
                  
                  // Handle Revision Synchronization (RSAT-R01)
                  const newDocs = docs.map((d: any) => {
                    if (d.id === docId) {
                      return {
                        ...d,
                        version: String((parseFloat(d.version) || 1.0) + 1.0) + ".0",
                        status: "Draft",
                        updatedAt: Date.now()
                      };
                    }
                    if (docId === "rkjm" && (d.id === "rkt" || d.id === "rkas" || d.id === "ksp")) {
                       return { ...d, status: "Perlu Sinkronisasi", updatedAt: Date.now() };
                    }
                    if (docId === "rkt" && (d.id === "rkas" || d.id === "ksp")) {
                       return { ...d, status: "Perlu Sinkronisasi", updatedAt: Date.now() };
                    }
                    return d;
                  });
                  updateSetting("documents", "", newDocs);
                  
                  navigateToView(docId === "rkt" ? "rktDerivation" : docId === "rkas" ? "rkasDerivation" : docId === "ksp" ? "kspStudio" : "rkjmPipeline");
                }}>Lanjutkan Revisi</Button>`;

code = code.replace(oldBtn, newBtn);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed revision synchronization');
