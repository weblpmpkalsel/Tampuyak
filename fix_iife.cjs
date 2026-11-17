const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const target = `              )}
              
              {(() => {
                try {
                  const kg = KnowledgeGraph.getInstance();
                  if (settings.canonicalObjects) {
                    KnowledgeGraphHydrator.hydrate(kg, settings.canonicalObjects);
                  } else {
                    seedInitialGraph();
                  }
                  const documentModel = cachedDocumentModel;
                  return <EnterpriseDocumentViewer settings={settings} title={meta.title} document={documentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />;
                } catch (error: any) {
                  return <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                    <AlertTriangle className="w-12 h-12 mb-4 text-rose-500" />
                    <h3 className="text-xl font-bold mb-2">Knowledge Graph Hydration Failure</h3>
                    <p>{error.message}</p>
                  </div>;
                }
              })()}
            </div>`;

const replacement = `              )}
              
              {!cachedDocumentModel ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                  <AlertTriangle className="w-12 h-12 mb-4 text-rose-500" />
                  <h3 className="text-xl font-bold mb-2">Document Generation Failure</h3>
                  <p>Periksa konsol untuk detail error.</p>
                </div>
              ) : (
                <EnterpriseDocumentViewer settings={settings} title={meta.title} document={cachedDocumentModel} generatedBy={settings.principal?.name || "Kepala Sekolah"} />
              )}
            </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Fixed IIFE!");
