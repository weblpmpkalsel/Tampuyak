const fs = require('fs');

let cssContent = fs.readFileSync('src/index.css', 'utf8');

// replace existing gdds-signature stuff or just add GSLS
const oldSigCss = `.gdds-signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 3cm;
    column-gap: 2cm;
    margin-top: 2cm;
  }
  .gdds-signature-cell {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .gdds-signature-center {
    text-align: center;
    align-items: center;
  }
  .gdds-signature-name {
    font-weight: bold;
    text-decoration: underline;
    margin-top: 3cm;
  }`;

const newSigCss = `.gsls-signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 2cm;
    column-gap: 2cm;
    margin-top: 1.5cm;
    page-break-inside: avoid;
  }
  .gsls-signature-cell {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start; /* Default left-aligned */
  }
  .gsls-signature-cell.center {
    align-items: center;
    text-align: center;
  }
  .gsls-signature-cell.right {
    align-items: flex-start;
    margin-left: auto;
    width: fit-content;
  }
  .gsls-signature-space {
    height: 3.5cm; /* Target spacing 4-5cm total including title/name margins */
    width: 100%;
  }
  .gsls-signature-name {
    font-weight: bold;
    text-decoration: underline;
  }`;

if (cssContent.includes(oldSigCss)) {
  cssContent = cssContent.replace(oldSigCss, newSigCss);
} else {
  // Just append
  cssContent += '\n' + newSigCss;
}
fs.writeFileSync('src/index.css', cssContent);
console.log('patched css');
