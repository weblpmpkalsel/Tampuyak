const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  'py-12 space-y-12',
  'py-12 space-y-16'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched space!");
