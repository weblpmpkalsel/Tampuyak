const fs = require('fs');

const file = 'src/EnterpriseDocumentViewer.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "const orientationClass = chapterLayout.orientation === 'landscape' ? 'landscape-section ' : 'portrait-section ';\n    const chapterLayout = EnterpriseLayoutRegistry.getLayout(fixedId || chapter.id, title);",
  "const chapterLayout = EnterpriseLayoutRegistry.getLayout(fixedId || chapter.id, title);\n    const orientationClass = chapterLayout.orientation === 'landscape' ? 'landscape-section ' : 'portrait-section ';"
);
fs.writeFileSync(file, content);
