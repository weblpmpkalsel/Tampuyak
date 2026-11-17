const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

const targetStr = `                      <p className="mb-24 text-slate-800 whitespace-pre-line">{sig.label}</p>
                      
                      {/* Space for future enhancements: signatures, qr codes, etc (approx 4-5cm) */}
                      <div className="h-24 relative flex items-center justify-center -mt-20 mb-4">
                        {/* Empty block ready for electronic signatures / stamps */}
                      </div>
                      
                      <p className="font-bold underline mt-4 text-slate-900 relative z-20">{sig.name}</p>
                      <p className="text-slate-800 relative z-20">NIP. {sig.nip}</p>`;

const replaceStr = `                      <p className="text-slate-800 whitespace-pre-line">{sig.label}</p>
                      
                      {/* Space for future enhancements: signatures, qr codes, etc (approx 4-5cm) */}
                      <div className="h-40 relative flex items-center justify-center mb-2">
                        {/* Empty block ready for electronic signatures / stamps */}
                      </div>
                      
                      <p className="font-bold underline text-slate-900 relative z-20">{sig.name}</p>
                      <p className="text-slate-800 relative z-20">NIP. {sig.nip}</p>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("EnterpriseDocumentViewer signature spacing patched!");
