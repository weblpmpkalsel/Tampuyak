const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex3 = /<div id="printable-doc" className="w-\[210mm\] min-h-\[297mm\] bg-white shadow-xl ring-1 ring-slate-900\/5 print:shadow-none p-\[2\.5cm\] font-serif text-black relative flex flex-col">/s;

const replacement3 = `<div id="printable-doc" className="w-[210mm] min-h-[297mm] bg-white shadow-xl ring-1 ring-slate-900/5 print:shadow-none p-[2.5cm] font-serif text-black relative flex flex-col">
              {!isPrintReady && (
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10">
                  <div className="text-[15rem] font-black text-slate-500 transform -rotate-45 select-none tracking-widest whitespace-nowrap">DRAFT</div>
                </div>
              )}`;

code = code.replace(regex3, replacement3);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Added watermark');
