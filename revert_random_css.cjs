const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '{section.title && <><div className="h-8"></div><h3 data-toc-id={section.id} className="text-xl font-bold text-slate-900">{section.title}</h3><div className="h-4"></div></>}',
  '{section.title && <h3 data-toc-id={section.id} className="text-xl font-bold text-slate-900 mb-4 mt-8">{section.title}</h3>}'
);

code = code.replace(
  '{table.title && <><h4 className="font-bold text-slate-800">{table.title}</h4><div className="h-3"></div></>}',
  '{table.title && <h4 className="font-bold text-slate-800 mb-3">{table.title}</h4>}'
);

code = code.replace(
  '{table.program && <><h4 className="text-lg font-bold text-slate-800">{table.program}</h4><div className="h-2"></div></>}',
  '{table.program && <h4 className="text-lg font-bold text-slate-800 mb-2">{table.program}</h4>}'
);

code = code.replace(
  '<h5 className="font-bold text-slate-800 text-sm">{String.fromCharCode(97 + j)}. {act.title}</h5><div className="h-1"></div>',
  '<h5 className="font-bold text-slate-800 text-sm mb-1">{String.fromCharCode(97 + j)}. {act.title}</h5>'
);

code = code.replace(
  '<h5 className="font-bold text-slate-800 text-sm">Rencana Kegiatan:</h5><div className="h-2"></div>',
  '<h5 className="font-bold text-slate-800 text-sm mb-2">Rencana Kegiatan:</h5>'
);

code = code.replace(
  '<div className="h-6"></div><h4 className="font-bold text-slate-800">Proyeksi Target Capaian (4 Tahun):</h4><div className="h-2"></div>',
  '<h4 className="font-bold text-slate-800 mb-2 mt-6">Proyeksi Target Capaian (4 Tahun):</h4>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Reverted random CSS fixes!");
