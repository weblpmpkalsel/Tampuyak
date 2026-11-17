const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(
  '  const [qaMode, setQaMode] = useState(false);',
  '  const [qaMode, setQaMode] = useState(false);\n  const [refreshKey, setRefreshKey] = useState(0);'
);

code = code.replace(
  '          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={handleRedo} title="Redo" disabled={historyIndex >= history.length - 1}><Redo className="w-5 h-5" /></Button>\n                    <div className="h-6 w-px bg-slate-300 mx-2"></div>',
  '          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={handleRedo} title="Redo" disabled={historyIndex >= history.length - 1}><Redo className="w-5 h-5" /></Button>\n                    <div className="h-6 w-px bg-slate-300 mx-2"></div>\n          <Button variant="ghost" className="w-9 h-9 p-0 text-[var(--color-eds-text-secondary)] hover:bg-slate-100" onClick={() => { setRefreshKey(k => k + 1); showToast("Preview diperbarui", "success"); }} title="Refresh Preview">\n            <RefreshCcw className="w-5 h-5" />\n          </Button>'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Patched refresh!");
