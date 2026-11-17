const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '      </div>\n      )\}\n\n      {/* Table of Contents */}',
  '      </div>\n      </>\n      )\}\n\n      {/* Table of Contents */}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed JSX 5!");
