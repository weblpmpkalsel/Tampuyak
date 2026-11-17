const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '<h5 className="font-bold text-slate-800 text-sm mb-2">Rencana Kegiatan:</h5>',
  '<h5 className="font-bold text-slate-800 text-sm">Rencana Kegiatan:</h5><div className="h-2"></div>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed rencana title!");
