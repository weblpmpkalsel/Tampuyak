const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  'break-before: page;\n          }\n          .portrait-section {\n            page: portrait-page;\n            break-before: page;\n          }',
  'break-before: page;\n            page-break-before: always;\n          }\n          .portrait-section {\n            page: portrait-page;\n            break-before: page;\n            page-break-before: always;\n          }'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("CSS compat patched!");
