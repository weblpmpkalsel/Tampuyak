const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  /break-before: page;\s*page-break-before: always;/g,
  ''
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched CSS breaks!");
