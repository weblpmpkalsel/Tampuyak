const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// Force table-fixed layout to prevent horizontal overflow in PDF
code = code.replace(/<table className="w-full (text-sm |)border-collapse/g, '<table className="w-full table-fixed $1border-collapse');
code = code.replace(/<table className="w-full table-auto border-collapse/g, '<table className="w-full table-fixed border-collapse');

// Add word wrapping to all table cells that might overflow
code = code.replace(/className="border border-slate-300 p-3( text-(center|left))? align-top"/g, 'className="border border-slate-300 p-3$1 align-top break-words whitespace-normal"');
code = code.replace(/className="border border-slate-300 p-2 text-center align-middle font-bold text-\[10pt\] capitalize"/g, 'className="border border-slate-300 p-2 text-center align-middle font-bold text-[10pt] capitalize break-words whitespace-normal"');

// Fix print CSS to prevent overflow
code = code.replace(/max-width: none !important;/g, 'max-width: 100% !important; overflow-x: hidden;');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched tables!");
