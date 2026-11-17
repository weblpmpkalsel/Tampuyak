const fs = require('fs');
const PDFParser = require('pdf2json');

function checkPdf(filename) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filename)) {
      console.log(`File ${filename} not found`);
      return resolve();
    }
    const fileSize = fs.statSync(filename).size;
    console.log(`\n============================`);
    console.log(`--- Checking ${filename} ---`);
    console.log(`============================`);
    console.log("File size:", fileSize, "bytes");

    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => {
      console.error(errData.parserError);
      resolve();
    });
    pdfParser.on("pdfParser_dataReady", pdfData => {
        const pageCount = pdfData.Pages.length;
        console.log("Page count:", pageCount);
        
        const rawText = pdfParser.getRawTextContent().trim();
        console.log("First 150 chars:", rawText.substring(0, 150).replace(/\n/g, ' '));
        resolve();
    });

    pdfParser.loadPDF(filename);
  });
}

(async () => {
  await checkPdf('ksp_final.pdf');
  await checkPdf('rkjm_final.pdf');
  await checkPdf('rkt_final.pdf');
  await checkPdf('rkas_final.pdf');
})();
