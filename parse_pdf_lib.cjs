const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
(async () => {
  const dataBuffer = fs.readFileSync('test_print_output.pdf');
  const pdfDoc = await PDFDocument.load(dataBuffer);
  console.log("Page count:", pdfDoc.getPageCount());
})();
