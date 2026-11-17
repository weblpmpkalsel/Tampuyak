const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace duplicate Search button
code = code.replace(
  '          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={() => showToast("Fungsi Cari", "info")} title="Cari di Dokumen">\n            <Search className="w-5 h-5" />\n          </Button>',
  ''
);

// Replace zoom controls to add Reset Zoom
code = code.replace(
  '            <span className="text-xs font-bold text-[var(--color-eds-text-primary)] w-12 text-center">{zoom}%</span>',
  '            <Button variant="ghost" className="w-auto min-w-[3rem] h-7 p-0 text-xs font-bold text-[var(--color-eds-text-primary)] hover:bg-slate-200 rounded" onClick={() => setZoom(100)} title="Reset Zoom">{zoom}%</Button>'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Patched zoom and search!");
