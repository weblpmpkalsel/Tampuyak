const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// Update renderChapter signature to accept a fixedId
code = code.replace(
  'const renderChapter = (chapter: DocumentChapter) => {',
  'const renderChapter = (chapter: DocumentChapter, fixedId: string = "") => {'
);

// Use fixedId for DOM ID and stable key
code = code.replace(
  '      <div key={chapter.id} id={`chapter-${chapter.id}`} className={`break-before-page pt-8 ${orientationClass}`} style={{ pageBreakBefore: "always", breakBefore: "page" }}>',
  '      <div key={fixedId || chapter.id} id={`chapter-${fixedId || chapter.id}`} className={`break-before-page pt-8 ${orientationClass}`} style={{ pageBreakBefore: "always", breakBefore: "page" }}>'
);
code = code.replace(
  '        <h2 data-toc-id={chapter.id} className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wider text-center border-b-2 border-slate-800 pb-4">',
  '        <h2 data-toc-id={fixedId || chapter.id} className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wider text-center border-b-2 border-slate-800 pb-4">'
);

// Change section key to sectionIndex for stability
code = code.replace(
  '      <div key={section.id} className={`mb-8 section-container ${applyPageBreak ? \'break-before-page pt-8\' : \'\'}`} style={applyPageBreak ? { pageBreakBefore: "always", breakBefore: "page" } : {}}>',
  '      <div key={`sec-${sectionIndex}`} className={`mb-8 section-container ${applyPageBreak ? \'break-before-page pt-8\' : \'\'}`} style={applyPageBreak ? { pageBreakBefore: "always", breakBefore: "page" } : {}}>'
);

// Update calls to renderChapter
code = code.replace('{renderChapter(document.chapter1)}', '{renderChapter(document.chapter1, "bab1")}');
code = code.replace('{renderChapter(document.chapter2)}', '{renderChapter(document.chapter2, "bab2")}');
code = code.replace('{renderChapter(document.chapter3)}', '{renderChapter(document.chapter3, "bab3")}');
code = code.replace('{renderChapter(document.chapter4)}', '{renderChapter(document.chapter4, "bab4")}');
code = code.replace('{renderChapter(document.chapter5)}', '{renderChapter(document.chapter5, "bab5")}');
code = code.replace('{renderChapter(document.appendix)}', '{renderChapter(document.appendix, "lampiran")}');

// Update pageNumbers mapping logic in TOC
code = code.replace('pageNumbers[chapter.id]', 'pageNumbers[i === 0 ? "bab1" : i === 1 ? "bab2" : i === 2 ? "bab3" : i === 3 ? "bab4" : i === 4 ? "bab5" : "lampiran"]');

// Update chapter1El check in calculatePages
code = code.replace('const chapter1El = window.document.getElementById(`chapter-${document.chapter1?.id}`);', 'const chapter1El = window.document.getElementById(`chapter-bab1`) || window.document.getElementById(`chapter-${document.chapter1?.id}`);');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched viewer keys and IDs!");
