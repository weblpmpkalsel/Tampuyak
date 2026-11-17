const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  "jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }",
  "pagebreak:    { mode: ['css', 'legacy'] },\n      jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }"
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched pagebreak!");
