const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

// Add import
const importStatement = "import { DefaultDocumentLayoutConfig } from './enterprise/document/layout/LayoutEngine';\n";
if (!content.includes('DefaultDocumentLayoutConfig')) {
  content = content.replace("import { EditableRegion } from './workspace/EditableRegion';", "import { EditableRegion } from './workspace/EditableRegion';\n" + importStatement);
}

// Replace Signature blocks
// <div className="relative flex items-center justify-center mb-4 w-full" style={{ minHeight: "8rem" }}>
// There are three approval signature blocks, we can replace them using the layout config.
content = content.replace(
  /<div className="relative flex items-center justify-center mb-4 w-full" style=\{\{ minHeight: "8rem" \}\}>/g,
  '<div className="relative flex items-center justify-center mb-4 w-full" style={{ minHeight: DefaultDocumentLayoutConfig.spacing.signatureBlockHeight }}>'
);
content = content.replace(
  /<div className="relative flex items-center justify-center mb-2 w-full" style=\{\{ minHeight: "10rem" \}\}>/g,
  '<div className="relative flex items-center justify-center mb-2 w-full" style={{ minHeight: DefaultDocumentLayoutConfig.spacing.signatureBlockHeight }}>'
);

// We need to inject the layout properties for page breaks
// Replace fixed page-break-before with dynamic classes based on config

// Cover: page-break-after
content = content.replace(
  'page-break-after"',
  '${DefaultDocumentLayoutConfig.pageBreaks.beforeApproval ? "page-break-after" : ""}"'
);

// Approval: page-break-before page-break-after
content = content.replace(
  'page-break-before page-break-after"',
  '${DefaultDocumentLayoutConfig.pageBreaks.beforeApproval ? "page-break-before" : ""} ${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-after" : ""}"'
);

// TOC: page-break-before
content = content.replace(
  'page-break-before"',
  '${DefaultDocumentLayoutConfig.pageBreaks.beforeTOC ? "page-break-before" : ""}"'
);

// Chapters
content = content.replace(
  'className={`pt-8 ${orientationClass} page-break-before`}',
  'className={`pt-8 ${orientationClass} ${DefaultDocumentLayoutConfig.pageBreaks.beforeChapter ? "page-break-before" : ""}`}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
