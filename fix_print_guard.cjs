const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Give Print Guard an ID
code = code.replace(
    `<div className="hidden print:flex fixed inset-0 items-center justify-center bg-white text-black text-2xl font-bold z-[9999]">`,
    `<div id="print-guard" className="hidden print:flex fixed inset-0 items-center justify-center bg-white text-black text-2xl font-bold z-[9999]">`
);

// Define handleOfficialPrint inside DocumentWorkspaceView
const injectHandleOfficialPrint = `
  const handleOfficialPrint = () => {
    const guard = document.getElementById('print-guard');
    if (guard) guard.style.setProperty('display', 'none', 'important');
    window.print();
    setTimeout(() => {
      if (guard) guard.style.removeProperty('display');
    }, 500);
  };
`;
code = code.replace(
    /const DocumentWorkspaceView = \(\{\s*docId,\s*navigateToView,\s*setPrintMode\s*\}\s*:\s*any\) => \{/,
    `const DocumentWorkspaceView = ({ docId, navigateToView, setPrintMode }: any) => {${injectHandleOfficialPrint}`
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
