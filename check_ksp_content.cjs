const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const rawText = pdfParser.getRawTextContent();
    const idx = rawText.indexOf('P E N G O R G A N ISA SIA N');
    if (idx !== -1) {
       console.log(rawText.substring(idx, idx + 2000));
    }
});
pdfParser.loadPDF("ksp_final.pdf");
