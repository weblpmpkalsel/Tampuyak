const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '<div id="chapter-cover" className="flex flex-col items-center justify-between text-center page-break-after h-[247mm] box-border portrait-section">',
  '<div id="chapter-cover" className="flex flex-col items-center justify-between text-center page-break-after min-h-[257mm] box-border portrait-section print-no-break" style={{ pageBreakAfter: "always", breakAfter: "page" }}>'
);

code = code.replace(
  '        {/* Top Header */}',
  '        {/* Top Header */}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched cover!");
