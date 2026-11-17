const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  'page-break-after min-h-[257mm] box-border portrait-section print-no-break" style={{ pageBreakAfter: "always", breakAfter: "page" }}',
  'min-h-[257mm] box-border portrait-section print-no-break"'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched cover break!");
