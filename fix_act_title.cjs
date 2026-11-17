const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '<h5 className="font-bold text-slate-800 text-sm mb-1">{String.fromCharCode(97 + j)}. {act.title}</h5>',
  '<h5 className="font-bold text-slate-800 text-sm">{String.fromCharCode(97 + j)}. {act.title}</h5><div className="h-1"></div>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed act title!");
