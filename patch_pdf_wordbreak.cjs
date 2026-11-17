const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  'tr, td, th { page-break-inside: avoid; break-inside: avoid; }',
  'tr, td, th { page-break-inside: avoid; break-inside: avoid; word-break: break-word !important; white-space: normal !important; }'
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched PDF CSS!");
