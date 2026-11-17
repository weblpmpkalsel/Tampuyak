const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

const oldCss = `        @media print {
          @page {
            size: portrait;
          }
          @page landscape-page {
            size: landscape;
            margin: 2cm;
          }
          .landscape-section {
            page: landscape-page;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }`;

const newCss = `        @media print {
          @page {
            size: portrait;
          }
          @page landscape-page {
            size: landscape;
            margin: 2cm;
          }
          @page portrait-page {
            size: portrait;
            margin: 2cm;
          }
          .landscape-section {
            page: landscape-page;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            break-before: page;
          }
          .portrait-section {
            page: portrait-page;
            break-before: page;
          }`;

code = code.replace(oldCss, newCss);

// Also make sure chapter div has break-before: page inline or through class
const oldRender = `className={\`page-break-before pt-8 \${orientationClass}\`} style={{ pageBreakBefore: "always" }}`;
const newRender = `className={\`break-before-page pt-8 \${orientationClass}\`} style={{ pageBreakBefore: "always", breakBefore: "page" }}`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Pagination patched!");
