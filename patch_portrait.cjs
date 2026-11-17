const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '.portrait-section {\n            page: portrait-page;',
  '.portrait-section {\n            page: portrait-page;\n            width: 100% !important;\n            max-width: 100% !important;\n            overflow-x: hidden;'
);

// We also need to add table styles to print css to force table layout
code = code.replace(
  'tr, td, th {',
  'table {\n            table-layout: fixed !important;\n            width: 100% !important;\n            max-width: 100% !important;\n          }\n          tr, td, th {'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched print css!");
