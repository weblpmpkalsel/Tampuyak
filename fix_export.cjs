const fs = require('fs');

let content = fs.readFileSync('src/DocumentExportEngine.ts', 'utf8');

content = content.replace(
  "import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';",
  "import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';\nimport { EnterpriseLayoutRegistry } from './enterprise/document/layout/LayoutEngine';"
);

// We need to know which chapter is being mapped. `chapters` array in `generateDocx`:
// const chapters = [ model.cover, model.approval, model.toc, model.chapter1, model.chapter2, model.chapter3, model.chapter4, model.chapter5, model.appendix ];
// we could do chapters.forEach((chapter, index) => ... )
// fixedIds = ["cover", "approval", "toc", "bab1", "bab2", "bab3", "bab4", "bab5", "lampiran"]

content = content.replace(
  'chapters.forEach(chapter => {',
  `const fixedIds = ["cover", "approval", "toc", "bab1", "bab2", "bab3", "bab4", "bab5", "lampiran"];
    chapters.forEach((chapter, index) => {
      const fixedId = fixedIds[index];
      const chapterLayout = EnterpriseLayoutRegistry.getLayout(fixedId || chapter.id, metadata.title);`
);

content = content.replace(
  "const sectionProps = chapter.orientation === 'landscape' ? {",
  "const sectionProps = chapterLayout.orientation === 'landscape' ? {"
);

// We also need to fix `isLandscape` for jsPDF:
content = content.replace(
  "const isLandscape = false; // TODO: dynamically detect if any chapter needs landscape",
  "const isLandscape = chapters.some((c, i) => c && EnterpriseLayoutRegistry.getLayout(fixedIds[i] || c.id, metadata.title).orientation === 'landscape');"
);

// Wait, the jsPDF code might not have `chapters` array in scope or something?
// Let's check where `isLandscape` is in `DocumentExportEngine.ts`

fs.writeFileSync('src/DocumentExportEngine.ts', content);
