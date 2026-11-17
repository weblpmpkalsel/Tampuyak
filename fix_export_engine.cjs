const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  "try {\n      const pdfBlob = await html2pdf().from(htmlContent).set(opt as any).output('blob');",
  `try {
      console.log("DOM elements before export:", typeof htmlContent === 'string' ? "string" : htmlContent.querySelectorAll('*').length);
      const pdfBlob = await html2pdf().from(htmlContent).set(opt as any).output('blob');`
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Added debugging to Export Engine!");
