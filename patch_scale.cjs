const fs = require('fs');
let file = fs.readFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', 'utf8');

file = file.replace(/width: \`\$\{210 \* scale\}mm\`,/g, 'width: `210mm`, minHeight: `297mm`, margin: `0 auto`,');
file = file.replace(/paddingTop: \`\$\{3 \* scale\}cm\`,/g, 'paddingTop: `3cm`,');
file = file.replace(/paddingBottom: \`\$\{3 \* scale\}cm\`,/g, 'paddingBottom: `3cm`,');
file = file.replace(/paddingLeft: \`\$\{4 \* scale\}cm\`,/g, 'paddingLeft: `4cm`,');
file = file.replace(/paddingRight: \`\$\{3 \* scale\}cm\`,/g, 'paddingRight: `3cm`,');
file = file.replace(/style=\{\{ fontSize: \`\$\{scale\}rem\` \}\}/g, '');
file = file.replace(/className=\{\`bg-white shadow-lg print:shadow-none gdds-doc gdds-page-wrapper print-section-override \$\{isCover \? 'text-center' : ''\}\`\}/g, "className={`bg-white shadow-lg print:shadow-none gdds-doc portrait-section print-section-override ${isCover ? 'text-center' : ''}`}");

fs.writeFileSync('src/enterprise/workspace/preview/CanonicalRenderer.tsx', file);
