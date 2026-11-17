const fs = require('fs');

let docViewer = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');
docViewer = docViewer.replace(
  'table-layout: auto !important;\n            width: 100% !important;',
  'table-layout: fixed !important;\n            width: 100% !important;'
);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', docViewer);

let exportEngine = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');
exportEngine = exportEngine.replace(
  "t.style.tableLayout = 'auto';",
  "t.style.tableLayout = 'fixed';"
);
exportEngine = exportEngine.replace(
  'table { table-layout: auto !important;',
  'table { table-layout: fixed !important;'
);
fs.writeFileSync('src/DocumentExportEngine.ts', exportEngine);

console.log("Patched table layout!");
