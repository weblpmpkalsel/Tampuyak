const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  "pagebreak:    { mode: ['css', 'legacy'] },",
  "pagebreak:    { mode: ['css', 'legacy'], avoid: ['tr', 'h2', 'h3', 'h4', 'h5', 'h6', '.signature-block', '.page-break-inside-avoid'] },"
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched PDF pagebreak!");
