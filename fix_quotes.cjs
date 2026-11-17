const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

// Fix Cover
content = content.replace(
  'id="chapter-cover" className="flex flex-col items-center justify-center text-center box-border portrait-section print-no-break py-12 space-y-16 ${DefaultDocumentLayoutConfig.pageBreaks.beforeApproval ? "page-break-after" : ""}"',
  'id="chapter-cover" className={`flex flex-col items-center justify-center text-center box-border portrait-section print-no-break py-12 space-y-16 ${DefaultDocumentLayoutConfig.pageBreaks.beforeApproval ? "page-break-after" : ""}`}'
);

// Fix Approval
content = content.replace(
  'id="chapter-approval" className="pt-8 portrait-section ${DefaultDocumentLayoutConfig.pageBreaks.beforeApproval ? "${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-before" : ""}" : ""} ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-after" : ""}"',
  'id="chapter-approval" className={`pt-8 portrait-section ${DefaultDocumentLayoutConfig.pageBreaks.beforeApproval ? "page-break-before" : ""} ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-after" : ""}`}'
);

// TOC: it was replaced like this:
// id="chapter-toc" className="pt-8 portrait-section ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-before" : ""}"
content = content.replace(
  'id="chapter-toc" className="pt-8 portrait-section ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-before" : ""}"',
  'id="chapter-toc" className={`pt-8 portrait-section ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-before" : ""}`}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
