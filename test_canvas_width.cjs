const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');
code = code.replace(
  '#printable-doc-export { transform: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; max-width: 100% !important; min-width: 0 !important; }',
  '/* removed printable-doc-export css */'
);
fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Removed #printable-doc-export CSS rule!");
