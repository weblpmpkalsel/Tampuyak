const fs = require('fs');
let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

content = content.replace(
  '<div id="chapter-toc" className="pt-8 portrait-section page-break-before">',
  '<div id="chapter-toc" className={`pt-8 portrait-section ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-before" : ""}`}>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
