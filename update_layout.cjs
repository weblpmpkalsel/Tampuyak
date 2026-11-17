const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

// 1. Cover: ensure page break after
// It currently has: <div id="chapter-cover" className="flex flex-col items-center justify-center text-center  box-border portrait-section print-no-break py-12 space-y-16">
content = content.replace(
  'id="chapter-cover" className="flex flex-col items-center justify-center text-center  box-border portrait-section print-no-break py-12 space-y-16"',
  'id="chapter-cover" className="flex flex-col items-center justify-center text-center box-border portrait-section print-no-break py-12 space-y-16 page-break-after"'
);

// 2. Approval: ensure page break before and after
// <div id="chapter-approval" className="pt-8 portrait-section ">
content = content.replace(
  'id="chapter-approval" className="pt-8 portrait-section "',
  'id="chapter-approval" className="pt-8 portrait-section page-break-before page-break-after"'
);

// 3. TOC: ensure page break before
// <div id="chapter-toc" className="pt-8 portrait-section ">
content = content.replace(
  'id="chapter-toc" className="pt-8 portrait-section "',
  'id="chapter-toc" className="pt-8 portrait-section page-break-before"'
);

// 4. Chapters: ensure page break before
// <div key={fixedId || chapter.id} id={`chapter-${fixedId || chapter.id}`} className={`pt-8 ${orientationClass}`}>
content = content.replace(
  'className={`pt-8 ${orientationClass}`}',
  'className={`pt-8 ${orientationClass} page-break-before`}'
);

// 5. Signature blocks: use dynamic layout instead of hardcoded h-24/h-40
// <div className="h-24 relative flex items-center justify-center mb-4 w-full">
// There are multiple h-24 and h-40. Let's replace them with a dynamic min-height via style.
content = content.replace(/className="h-24 relative flex items-center justify-center mb-4 w-full"/g, 'className="relative flex items-center justify-center mb-4 w-full" style={{ minHeight: "8rem" }}');
content = content.replace(/className="h-40 relative flex items-center justify-center mb-2"/g, 'className="relative flex items-center justify-center mb-2 w-full" style={{ minHeight: "10rem" }}');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
