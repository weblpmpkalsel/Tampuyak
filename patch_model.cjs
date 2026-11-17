const fs = require('fs');
let code = fs.readFileSync('src/DocumentCompositionEngine/DocumentModel.ts', 'utf-8');
code = code.replace(
  '  pageBreak?: boolean;',
  '  pageBreak?: boolean;\n  orientation?: "portrait" | "landscape";'
);
fs.writeFileSync('src/DocumentCompositionEngine/DocumentModel.ts', code);
console.log("DocumentModel patched!");
