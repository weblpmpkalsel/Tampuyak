const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// The replacement failed because the spacing was off or something.
// Let's just find the `)}` right before `{/* Table of Contents */}` and insert `</>` before it.

code = code.replace(
  '      </div>\n      )}\n      {/* Table of Contents */}',
  '      </div>\n      </>\n      )}\n      {/* Table of Contents */}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed JSX 3!");
