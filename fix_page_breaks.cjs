const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  /<div className="html2pdf__page-break" style=\{\{ pageBreakBefore: "always", breakBefore: "page" \}\}>\<\/div>/g,
  '<div className="html2pdf__page-break print:break-before-page"></div>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed page breaks!");
