const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '      ) : (\n      <div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>\n      <div id="chapter-approval" className="pt-8 portrait-section">',
  '      ) : (\n      <>\n      <div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>\n      <div id="chapter-approval" className="pt-8 portrait-section">'
);

code = code.replace(
  '           </div>\n         )}\n      </div>\n      )}\n      {/* Table of Contents */}',
  '           </div>\n         )}\n      </div>\n      </>\n      )}\n      {/* Table of Contents */}'
);

// We also need to fix TOC which is inside the main div directly.
// The main div is a block, so it can have multiple children. But we replaced the TOC div with TWO divs.
// Wait! `<div></div> <div>...</div>` inside the main `<div>` is perfectly fine! Because it's not a ternary branch, it's just children of `<div ref={containerRef}>`.
// But let's check what I replaced for TOC:
// `<div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>\n      <div id="chapter-toc" className="pt-8 portrait-section">`
// This is fine.

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed JSX 2!");
