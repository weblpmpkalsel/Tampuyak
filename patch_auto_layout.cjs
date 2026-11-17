const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

// Revert table-fixed back to table-auto
code = code.replace(/table-fixed/g, 'table-auto');
// Except in print css if we added it there
code = code.replace(/table-layout: auto !important;/g, 'table-layout: auto !important;');

// Ensure max-width: 100% is on the tables
code = code.replace(/<table className="w-full table-auto/g, '<table className="w-full table-auto max-w-full');

// Ensure aggressive word breaking on cells to prevent overflow under table-auto
code = code.replace(/break-words whitespace-normal/g, 'break-words whitespace-normal [word-break:break-word] min-w-[50px]');

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched auto layout!");
