const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '{section.title && <h3 data-toc-id={section.id} className="text-xl font-bold text-slate-900 mb-4 mt-8">{section.title}</h3>}',
  '{section.title && <><div className="h-8"></div><h3 data-toc-id={section.id} className="text-xl font-bold text-slate-900">{section.title}</h3><div className="h-4"></div></>}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed section heading!");
