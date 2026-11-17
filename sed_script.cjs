const fs = require('fs');
let data = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');
data = data.replace(/@media print \{[\s\S]*?\/\* Reset root transform from preview zoom \*\//, `@media print {
          /* Reset root transform from preview zoom */`);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', data);
