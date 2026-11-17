const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '<div id="chapter-approval" className="page-break-before pt-8" style={{ pageBreakBefore: "always" }}>',
  '<div id="chapter-approval" className="break-before-page pt-8 portrait-section" style={{ pageBreakBefore: "always", breakBefore: "page" }}>'
);

code = code.replace(
  '<div id="chapter-toc" className="page-break-before pt-8" style={{ pageBreakBefore: "always" }}>',
  '<div id="chapter-toc" className="break-before-page pt-8 portrait-section" style={{ pageBreakBefore: "always", breakBefore: "page" }}>'
);

// Cover already has it
// <div id="chapter-cover" className="flex flex-col items-center justify-between text-center page-break-after h-[247mm] box-border portrait-section">

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Sections patched!");
