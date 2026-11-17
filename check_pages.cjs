const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function check() {
  const files = ['RKJM_FINAL.pdf', 'RKT_FINAL.pdf', 'RKAS_FINAL.pdf'];
  for (const file of files) {
    if (fs.existsSync(file)) {
      const buf = fs.readFileSync(file);
      const pdf = await PDFDocument.load(buf);
      console.log(`${file}: ${pdf.getPageCount()} pages`);
    }
  }
}
check();
