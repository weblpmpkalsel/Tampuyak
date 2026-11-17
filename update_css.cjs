const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/@page \{[\s\S]*?\}/, `@page {
      size: A4 portrait;
      margin: 3cm 3cm 3cm 4cm; /* Top, Right, Bottom, Left */
    }`);

// add specific print classes
css += `
@layer utilities {
  .gdds-doc {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: black;
  }
  
  .gdds-title-doc {
    font-size: 16pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
  }
  
  .gdds-title-bab {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin-top: 24pt;
    margin-bottom: 12pt;
  }
  
  .gdds-heading-2 {
    font-size: 12pt;
    font-weight: bold;
    text-transform: capitalize;
    margin-top: 24pt;
    margin-bottom: 12pt;
    page-break-after: avoid;
  }

  .gdds-heading-3 {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 6pt;
    page-break-after: avoid;
  }
  
  .gdds-p {
    text-align: justify;
    text-indent: 1.27cm;
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .gdds-p-no-indent {
    text-align: justify;
    margin-top: 0;
    margin-bottom: 12pt;
  }

  .gdds-list-item {
    margin-bottom: 6pt;
    padding-left: 0.63cm;
  }

  .gdds-toc-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6pt;
    line-height: 1.5;
  }
  
  .gdds-toc-dots {
    flex-grow: 1;
    border-bottom: 1px dotted black;
    margin-left: 8px;
    margin-right: 8px;
    position: relative;
    top: -4px;
  }
  
  .gdds-signature-grid {
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

  .gdds-signature-left {
    text-align: left;
  }

  .gdds-signature-right {
    text-align: right;
  }

  .gdds-signature-center {
    text-align: center;
  }

  .gdds-signature-name {
    font-weight: bold;
    text-decoration: underline;
    margin-top: 3cm;
  }
}
`;

fs.writeFileSync('src/index.css', css);
console.log('CSS updated');
