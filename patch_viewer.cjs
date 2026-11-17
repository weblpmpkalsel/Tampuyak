const fs = require('fs');
let file = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

// Cover
file = file.replace(
  /id="chapter-cover" className=\{\`portrait-section gdds-page-wrapper text-center print-no-break\`\}/,
  'id="chapter-cover" className={`portrait-section gdds-page-wrapper text-center print-no-break gdds-cover-layout`}'
);

file = file.replace(
  /\{\/\* Top Header \*\/\}\s*<div className="w-full shrink-0">/,
  '{/* Top Header */}\n        <div className="w-full shrink-0 gdds-cover-top">'
);

// Group Logo and Title into middle
file = file.replace(
  /\{\/\* Logo \*\/\}\s*<div className="w-full flex items-center justify-center shrink my-4">/,
  '{/* Logo */}\n        <div className="w-full flex flex-col items-center justify-center shrink gdds-cover-middle">'
);

// Remove Document Title outer div so it stays in middle
file = file.replace(
  /<\/div>\s*\{\/\* Document Title \*\/\}\s*<div className="w-full shrink-0 my-4 md:my-8">/,
  '{/* Document Title */}\n        <div className="w-full shrink-0 mt-8">'
);

file = file.replace(
  /\{\/\* Bottom Metadata \*\/\}\s*<div className="w-full shrink-0">/,
  '{/* Bottom Metadata */}\n        <div className="w-full shrink-0 gdds-cover-bottom">'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', file);
