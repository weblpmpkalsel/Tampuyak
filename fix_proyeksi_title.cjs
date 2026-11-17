const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '<h4 className="font-bold text-slate-800 mb-2 mt-6">Proyeksi Target Capaian (4 Tahun):</h4>',
  '<div className="h-6"></div><h4 className="font-bold text-slate-800">Proyeksi Target Capaian (4 Tahun):</h4><div className="h-2"></div>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed proyeksi title!");
