const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  'onclone: (clonedDoc: Document) => {',
  'onclone: (clonedDoc: HTMLDocument) => {'
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched type!");
