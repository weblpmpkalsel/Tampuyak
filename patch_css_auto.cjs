const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '          table {\n            table-layout: fixed !important;\n            width: 100% !important;\n            max-width: 100% !important;\n          }',
  '          table {\n            table-layout: auto !important;\n            width: 100% !important;\n            max-width: 100% !important;\n          }'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched css auto!");
