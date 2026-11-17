const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '{section.paragraphs.map((p, idx) => {',
  '{section.paragraphs.filter(p => p.trim() !== "").map((p, idx) => {'
);

code = code.replace(
  '{chapter.paragraphs && chapter.paragraphs.map((p, idx) => (',
  '{chapter.paragraphs && chapter.paragraphs.filter(p => p.trim() !== "").map((p, idx) => ('
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched paragraphs!");
