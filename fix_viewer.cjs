const fs = require('fs');
let file = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

file = file.replace(
  /\{\/\* Bottom Metadata \*\/\}/,
  '</div>\n        {/* Bottom Metadata */}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', file);
