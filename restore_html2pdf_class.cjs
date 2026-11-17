const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  /<div style=\{\{ pageBreakBefore: "always", breakBefore: "page" \}\}>\<\/div>/g,
  '<div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Restored html2pdf__page-break class!");
