const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  "const container = clonedDoc.getElementById('printable-doc');",
  "const container = clonedDoc.getElementById('printable-doc-export');"
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched engine IDs!");
