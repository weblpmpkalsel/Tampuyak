const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /if \(e\.ctrlKey && e\.key === 'p'\) \{\s*e\.preventDefault\(\);\s*setPrintMode\(\{ id: docId, isPrintReady \}\);\s*\}/g,
    `if (e.ctrlKey && e.key === 'p') {
        // Let the browser handle Ctrl+P, which will show the Print Guard naturally.
        // We can just return to not interfere, or call window.print().
        // If we call window.print(), the guard will show.
        e.preventDefault();
        window.print();
      }`
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
