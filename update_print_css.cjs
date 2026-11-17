const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

const targetCSS = `        @media print {
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
            max-width: 100% !important; overflow-x: hidden;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            break-before: page;
            page-break-before: always;
          }
          .portrait-section {
            page: portrait-page;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden;
            break-before: page;
            page-break-before: always;
          }
          .print-header {
            display: none !important;
          }
          .print-footer {
            display: none !important;
          }
          table {
            table-layout: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          tr, td, th {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
          h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
          }
          p {
            orphans: 3;
            widows: 3;
          }
        }`;

const replacementCSS = `        @media print {
          *, *::before, *::after {
            box-sizing: border-box !important;
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 2cm;
          }
          @page landscape-page {
            size: A4 landscape;
            margin: 2cm;
          }
          @page portrait-page {
            size: A4 portrait;
            margin: 2cm;
          }
          .landscape-section {
            page: landscape-page;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            break-before: page;
            page-break-before: always;
            transform: none !important;
          }
          .portrait-section {
            page: portrait-page;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            break-before: page;
            page-break-before: always;
            transform: none !important;
          }
          .print-header {
            display: none !important;
          }
          .print-footer {
            display: none !important;
          }
          table {
            table-layout: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
          }
          tr, td, th {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          p {
            orphans: 3;
            widows: 3;
            page-break-inside: avoid;
          }
          /* Typography Normalization for Print */
          body {
            line-height: 1.5 !important;
            text-align: left !important;
          }
          p {
            text-align: justify !important;
            hyphens: auto !important;
          }
          /* Reset root transform from preview zoom */
          #printable-doc-export, #printable-doc-preview {
             transform: none !important;
             width: 100% !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
             max-width: 100% !important;
             min-width: 0 !important;
          }
        }`;

code = code.replace(targetCSS, replacementCSS);
fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Updated print CSS!");
