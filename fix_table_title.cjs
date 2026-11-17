const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '{table.title && <h4 className="font-bold text-slate-800 mb-3">{table.title}</h4>}',
  '{table.title && <><h4 className="font-bold text-slate-800">{table.title}</h4><div className="h-3"></div></>}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed table title!");
