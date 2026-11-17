const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(
  '<div className="fixed inset-0 bg-slate-900/90 z-[9999] flex flex-col items-center justify-center p-8">',
  '<div className="fixed inset-0 bg-slate-900/90 z-[9999] flex flex-col items-center justify-center p-8 print:hidden">'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Patched overlay!");
