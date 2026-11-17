const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

content = content.replace(
  '    return (\n      <>\n        const chapterLayout = chapter.layout || DefaultDocumentLayoutConfig;\n        <div key={fixedId || chapter.id}',
  '    const chapterLayout = chapter.layout || DefaultDocumentLayoutConfig;\n    return (\n      <>\n        <div key={fixedId || chapter.id}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
