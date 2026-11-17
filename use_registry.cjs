const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

content = content.replace(
  'const chapterLayout = chapter.layout || DefaultDocumentLayoutConfig;',
  'const chapterLayout = typeof (window as any).getChapterLayoutConfig === "function" ? (window as any).getChapterLayoutConfig(chapter.id) : DefaultDocumentLayoutConfig;'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
