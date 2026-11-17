const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// Ensure proper break rules
code = code.replace(
  'h2, h3, h4, h5, h6 {\n            page-break-after: avoid;\n            break-after: avoid;\n            page-break-inside: avoid;\n            break-inside: avoid;\n          }',
  'h2, h3, h4, h5, h6 {\n            page-break-after: avoid !important;\n            break-after: avoid !important;\n            page-break-inside: avoid !important;\n            break-inside: avoid !important;\n            display: block;\n          }'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched heading CSS!");
