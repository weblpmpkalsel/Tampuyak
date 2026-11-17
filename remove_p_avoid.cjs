const fs = require('fs');

let docViewer = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');
docViewer = docViewer.replace(
  'p {\n            orphans: 3;\n            widows: 3;\n            page-break-inside: avoid;\n          }',
  'p {\n            orphans: 3;\n            widows: 3;\n          }'
);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', docViewer);

let exportEngine = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');
exportEngine = exportEngine.replace(
  'p { orphans: 3; widows: 3; page-break-inside: avoid; text-align: justify !important; hyphens: auto !important; }',
  'p { orphans: 3; widows: 3; text-align: justify !important; hyphens: auto !important; }'
);
fs.writeFileSync('src/DocumentExportEngine.ts', exportEngine);

console.log("Removed page-break-inside: avoid from p");
