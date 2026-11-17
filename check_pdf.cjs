const fs = require('fs');
const PDFParser = require('pdf2json');

const fileSize = fs.statSync('ksp_print_preview.pdf').size;
console.log("File size:", fileSize, "bytes");

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const pageCount = pdfData.Pages.length;
    console.log("Page count:", pageCount);
    
    // Extracted raw text
    const rawText = pdfParser.getRawTextContent();
    console.log("First 300 chars:");
    console.log(rawText.substring(0, 300).replace(/\n/g, ' '));
});

pdfParser.loadPDF("ksp_print_preview.pdf");
