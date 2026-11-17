const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  '          .portrait-section {\n            page: portrait-page;\n            break-before: page;\n            page-break-before: always;\n            clear: both;\n            display: block;\n            width: 100%;\n          }',
  '          .portrait-section {\n            page: portrait-page;\n            break-before: page;\n            page-break-before: always;\n          }'
);

code = code.replace(
  '      <React.Fragment key={chapter.id}>\n        <div style={{ pageBreakBefore: "always", breakBefore: "page", clear: "both", height: "0px", display: "block", content: \'""\' }} className="print-page-break" />\n        <div id={`chapter-${chapter.id}`} className={`pt-8 ${orientationClass}`} style={{ pageBreakBefore: "always", breakBefore: "page", clear: "both", display: "block", width: "100%" }}>',
  '      <div key={chapter.id} id={`chapter-${chapter.id}`} className={`break-before-page pt-8 ${orientationClass}`} style={{ pageBreakBefore: "always", breakBefore: "page" }}>'
);

code = code.replace(
  '        {chapter.sections.map((section, idx) => renderSection(section, idx))}\n      </div>\n      </React.Fragment>',
  '        {chapter.sections.map((section, idx) => renderSection(section, idx))}\n      </div>'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Viewer reverted!");
