const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

const target = 'className={`border border-slate-300 p-2 align-top text-[10pt] ${isNumericCol ? \'text-center whitespace-nowrap\' : \'text-left whitespace-normal [word-break:normal] [overflow-wrap:break-word]\'}`}';
const replacement = 'className={`border border-slate-300 p-2 align-top text-[10pt] min-w-[30px] overflow-hidden ${isNumericCol ? \'text-center\' : \'text-left break-words whitespace-normal [word-break:break-word]\'}`}';

code = code.replace(target, replacement);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched numeric cols 2!");
