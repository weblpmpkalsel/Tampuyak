const fs = require('fs');
let file = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

// Update SectionRenderer for Cover
file = file.replace(
  /className=\{\`bg-white shadow-lg print:shadow-none gdds-doc portrait-section print-section-override \$\{isCover \? 'text-center' : ''\}\`\}/g,
  "className={`bg-white shadow-lg print:shadow-none gdds-doc portrait-section print-section-override ${isCover ? 'text-center gdds-cover-layout' : ''}`}"
);

// Update block handling for cover-container-group
file = file.replace(
  /if \(isCover && block\.id\.startsWith\('cover-container-group'\)\) \{[\s\S]*?return \([\s\S]*?<div className="flex flex-col items-center gap-4 w-full">/g,
  `if (isCover && block.id.startsWith('cover-container-group')) {
           let groupClass = "flex flex-col items-center w-full";
           if (block.id === 'cover-container-group-top') groupClass += " gdds-cover-top";
           if (block.id === 'cover-container-group-middle') groupClass += " gdds-cover-middle";
           if (block.id === 'cover-container-group-bottom') groupClass += " gdds-cover-bottom";
           return (
             <div className={groupClass}>`
);

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', file);
