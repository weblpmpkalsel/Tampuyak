const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '<div key={section.id} className={\`mb-8 section-container \${applyPageBreak ? \'page-break-before pt-8\' : \'\'}\`} style={applyPageBreak ? { pageBreakBefore: "always" } : {}}>',
  '<div key={section.id} className={\`mb-8 section-container \${applyPageBreak ? \'break-before-page pt-8\' : \'\'}\`} style={applyPageBreak ? { pageBreakBefore: "always", breakBefore: "page" } : {}}>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Section break patched!");
