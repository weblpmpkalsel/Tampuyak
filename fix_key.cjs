const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '    return (\n      <>\n        {applyPageBreak',
  '    return (\n      <React.Fragment key={`frag-${sectionIndex}`}>\n        {applyPageBreak'
);

code = code.replace(
  '      </div>\n      </>\n    );\n  }',
  '      </div>\n      </React.Fragment>\n    );\n  }'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Fixed key!");
