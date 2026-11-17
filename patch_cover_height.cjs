const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  'min-h-[257mm]',
  'min-h-[247mm]'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched cover height!");
