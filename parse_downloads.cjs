const fs = require('fs');
const PDFParser = require("pdf2json");

const files = fs.readdirSync('./downloads').filter(f => f.endsWith('.pdf'));
const results = {};

let pending = files.length;

files.forEach(f => {
  const pdfParser = new PDFParser(this, 1);
  pdfParser.on("pdfParser_dataError", errData => {
    console.error(`Error parsing ${f}:`, errData.parserError);
    pending--;
    if (pending === 0) finish();
  });
  pdfParser.on("pdfParser_dataReady", pdfData => {
    const text = pdfParser.getRawTextContent();
    results[f] = {
      pages: pdfData.Pages.length,
      firstChars: text.substring(0, 150).replace(/\r?\n|\r/g, ' ')
    };
    pending--;
    if (pending === 0) finish();
  });
  
  pdfParser.loadPDF(`./downloads/${f}`);
});

function finish() {
  console.log("PDF Parsing Results:");
  console.log(JSON.stringify(results, null, 2));
}
