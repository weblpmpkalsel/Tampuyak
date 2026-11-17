const fs = require('fs');
let file = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

file = file.replace(/className="gdds-toc-row"/g, 'className="gdds-toc-layout"');
file = file.replace(/className="gdds-toc-row mt-4"/g, 'className="gdds-toc-layout mt-4"');
file = file.replace(/className="gdds-toc-dots"/g, 'className="gdds-toc-leader"');

file = file.replace(/<span className="font-bold text-slate-900 uppercase">/g, '<span className="gdds-toc-title font-bold text-slate-900 uppercase">');
file = file.replace(/<span className="text-slate-800">/g, '<span className="gdds-toc-title text-slate-800">');

// For page numbers, we can just let them be, or add gdds-toc-page
file = file.replace(/<span className="font-bold text-slate-900">\{pageNumbers/g, '<span className="gdds-toc-page font-bold text-slate-900">{pageNumbers');
file = file.replace(/<span className="text-slate-700">\{pageNumbers/g, '<span className="gdds-toc-page text-slate-700">{pageNumbers');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', file);
