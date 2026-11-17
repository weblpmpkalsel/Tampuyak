const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  "pagebreak:    { mode: ['css'], avoid:",
  "pagebreak:    { mode: ['css', 'legacy'], avoid:"
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Fixed export mode!");
