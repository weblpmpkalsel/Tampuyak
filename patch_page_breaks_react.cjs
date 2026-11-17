const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// For section rendering
code = code.replace(
  'return (\n      <div key={`sec-${sectionIndex}`} className={`mb-8 section-container ${applyPageBreak ? \'break-before-page pt-8\' : \'\'}`} style={applyPageBreak ? { pageBreakBefore: "always", breakBefore: "page" } : {}}>',
  'return (\n      <>\n        {applyPageBreak && <div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>}\n        <div key={`sec-${sectionIndex}`} className={`mb-8 section-container ${applyPageBreak ? \'pt-8\' : \'\'}`}>'
);
// Make sure to close the fragment for sections
code = code.replace(
  '    </p>\n          );\n        })}\n      </div>\n    );',
  '    </p>\n          );\n        })}\n      </div>\n      </>\n    );'
);

// For chapters
code = code.replace(
  'return (\n      <div key={fixedId || chapter.id} id={`chapter-${fixedId || chapter.id}`} className={`break-before-page pt-8 ${orientationClass}`} style={{ pageBreakBefore: "always", breakBefore: "page" }}>',
  'return (\n      <>\n        <div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>\n        <div key={fixedId || chapter.id} id={`chapter-${fixedId || chapter.id}`} className={`pt-8 ${orientationClass}`}>'
);
// Make sure to close the fragment for chapters
code = code.replace(
  '        {chapter.sections && chapter.sections.map((section, idx) => renderSection(section, idx))}\n      </div>\n    );',
  '        {chapter.sections && chapter.sections.map((section, idx) => renderSection(section, idx))}\n      </div>\n      </>\n    );'
);

// For approval
code = code.replace(
  '<div id="chapter-approval" className="break-before-page pt-8 portrait-section" style={{ pageBreakBefore: "always", breakBefore: "page" }}>',
  '<div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>\n      <div id="chapter-approval" className="pt-8 portrait-section">'
);

// For TOC
code = code.replace(
  '<div id="chapter-toc" className="break-before-page pt-8 portrait-section" style={{ pageBreakBefore: "always", breakBefore: "page" }}>',
  '<div className="html2pdf__page-break" style={{ pageBreakBefore: "always", breakBefore: "page" }}></div>\n      <div id="chapter-toc" className="pt-8 portrait-section">'
);

// We need to make sure the cover has a page break AFTER it, so we add one.
// The cover is followed by the approval page. The approval page has a page break before it.
// So we don't strictly need one after the cover, the approval page's before break is enough.
// Wait, what if the document title is 'RKAS'? Then `document.approval` is rendered, which is a chapter and thus has `pageBreakBefore`.
// So that's handled.

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched page breaks to use dedicated div!");
