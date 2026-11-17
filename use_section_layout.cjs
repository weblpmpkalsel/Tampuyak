const fs = require('fs');

let content = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf8');

// Replace chapter level rendering
content = content.replace(
  '<div key={fixedId || chapter.id} id={`chapter-${fixedId || chapter.id}`} className={`pt-8 ${orientationClass} ${DefaultDocumentLayoutConfig.pageBreaks.beforeChapter ? "page-break-before" : ""}`}>',
  'const chapterLayout = chapter.layout || DefaultDocumentLayoutConfig;\n        <div key={fixedId || chapter.id} id={`chapter-${fixedId || chapter.id}`} className={`pt-8 ${orientationClass} ${chapterLayout.pageBreaks?.beforeChapter ?? DefaultDocumentLayoutConfig.pageBreaks.beforeChapter ? "page-break-before" : ""}`}>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', content);
