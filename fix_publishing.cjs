const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionPublishingView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/title: `Dokumen_\\\$\{selectedDocType\}`/, "title: `Dokumen_${selectedDocType}`");
code = code.replace(/className=\{`w-full/, "className={`w-full");
code = code.replace(/transparent'\\n                  \}`\}/, "transparent'\n                  }`}");

fs.writeFileSync(file, code);
