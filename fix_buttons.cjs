const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Revert buttons back to window.print (or a custom print function)
code = code.replace(
    /onClick=\{\(\) => setPrintMode\(\{ id: docId, isPrintReady: false \}\)\}/g,
    `onClick={() => handleOfficialPrint()}`
);
code = code.replace(
    /onClick=\{\(\) => setPrintMode\(\{ id: docId, isPrintReady: true \}\)\}/g,
    `onClick={() => handleOfficialPrint()}`
);
code = code.replace(
    /onClick=\{\(\) => setPrintMode\(\{ id: docId, isPrintReady \}\)\}/g,
    `onClick={() => handleOfficialPrint()}`
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
