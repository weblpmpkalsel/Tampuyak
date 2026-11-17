const fs = require('fs');
let code = fs.readFileSync('src/EnterpriseDocumentViewer.tsx', 'utf-8');

code = code.replace(
  'text-center font-bold text-blue-700 align-top overflow-hidden',
  'text-center font-bold text-blue-700 align-top break-words whitespace-normal [word-break:break-word] min-w-[30px] overflow-hidden'
);

// We need to double check the dynamic td classes too.
code = code.replace(
  /className=\{\`border border-slate-300 p-2 align-top text-\[10pt\] min-w-\[30px\] overflow-hidden \$\{isNumericCol \? 'text-center' : 'text-left break-words whitespace-normal \[word-break:break-word\]'\}\`\}/g,
  'className={`border border-slate-300 p-2 align-top text-[10pt] min-w-[30px] overflow-hidden break-words whitespace-normal [word-break:break-word] ${isNumericCol ? "text-center" : "text-left"}`}'
);

fs.writeFileSync('src/EnterpriseDocumentViewer.tsx', code);
console.log("Patched td!");
