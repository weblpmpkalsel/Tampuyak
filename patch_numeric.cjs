const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  /\`border border-slate-300 p-2 align-top text-\\[10pt\\] \\$\\{isNumericCol \? 'text-center whitespace-nowrap' : 'text-left whitespace-normal \\[word-break:normal\\] \\[overflow-wrap:break-word\\]'\\}\`/g,
  '`border border-slate-300 p-2 align-top text-[10pt] min-w-[30px] ${isNumericCol ? \'text-center\' : \'text-left break-words whitespace-normal [word-break:break-word]\'}`'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched numeric cols!");
