const fs = require('fs');
const PDFParser = require("pdf2json");

async function parsePdf(file) {
  return new Promise((resolve, reject) => {
    let pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
      resolve({
        pageCount: pdfData.Pages.length,
        text: pdfParser.getRawTextContent()
      });
    });
    pdfParser.loadPDF(file);
  });
}

async function parseAll() {
  const files = ['KSP_RC.pdf', 'RKJM_RC.pdf', 'RKT_RC.pdf', 'RKAS_RC.pdf'];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.log(`${file} not found.`);
      continue;
    }
    try {
      const data = await parsePdf(file);
      console.log(`\n=== ${file} ===`);
      console.log("Page count:", data.pageCount);
      const text = data.text;
      
      const hasOverflow = text.includes('SATU RATUS DUA PULUH KARAKTER');
      const hasOverflow2 = text.includes('tiga ratus karakter');
      console.log(`Has Stress Test Name: ${hasOverflow}`);
      console.log(`Has Stress Test Address: ${hasOverflow2}`);
    } catch(e) {
      console.error(e);
    }
  }
}
parseAll();
