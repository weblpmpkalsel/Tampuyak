const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex4 = /onClick=\{handlePrintClick\} title="Cetak\/PDF" disabled=\{!isPrintReady\}/g;
const regex5 = /onClick=\{handleExportDocx\} title="Ekspor DOCX" disabled=\{!isPrintReady\}/g;

code = code.replace(regex4, 'onClick={handlePrintClick} title="Cetak/PDF" disabled={!isDraftReady}');
code = code.replace(regex5, 'onClick={handleExportDocx} title="Ekspor DOCX" disabled={!isPrintReady}'); // Export DOCX only for print ready? The rules said "Coverage blocks only: Final Certification, Final PDF, Official Export." So DOCX is blocked by !isPrintReady. But Draft Print Preview is allowed.

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Replaced top bar buttons');
