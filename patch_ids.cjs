const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(
  'const printDoc = document.getElementById("printable-doc");',
  'const printDoc = document.getElementById("printable-doc-export");'
);

code = code.replace(
  '<div id="printable-doc" className="w-[210mm] print:w-auto print:min-h-0 bg-white font-serif text-black relative block p-0 overflow-visible max-h-none mx-auto print:mx-0">',
  '<div id="printable-doc-export" className="w-[210mm] print:w-auto print:min-h-0 bg-white font-serif text-black relative block p-0 overflow-visible max-h-none mx-auto print:mx-0">'
);

code = code.replace(
  '<div id="printable-doc" className="w-[210mm] bg-white shadow-xl ring-1 ring-slate-900/5 print:shadow-none px-[2cm] py-[2.5cm] print:p-0 font-serif text-black relative block print:w-auto">',
  '<div id="printable-doc-preview" className="w-[210mm] bg-white shadow-xl ring-1 ring-slate-900/5 print:shadow-none px-[2cm] py-[2.5cm] print:p-0 font-serif text-black relative block print:w-auto">'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Patched IDs!");
