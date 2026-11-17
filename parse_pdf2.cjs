const fs = require('fs');
(async () => {
  const pdfParse = require('pdf-parse');
  const dataBuffer = fs.readFileSync('test_print_output.pdf');
  const data = await pdfParse(dataBuffer);
  console.log("Page count:", data.numpages);
  console.log("Text preview:");
  console.log(data.text.substring(0, 500).replace(/\n/g, ' '));
})();
