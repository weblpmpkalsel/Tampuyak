const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '{table.program && <h4 className="text-lg font-bold text-slate-800 mb-2">{table.program}</h4>}',
  '{table.program && <><h4 className="text-lg font-bold text-slate-800">{table.program}</h4><div className="h-2"></div></>}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed program title!");
