const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx', 'utf8');

code = code.replace(
  /<button onClick=\{\(\) => !isReady && setShowValidationDrawer\(true\)\} className=\{\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \$\{isReady \? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-pointer border-transparent'\}\`\}>\n\s*<FileText className="w-4 h-4" \/> Export PDF\n\s*<\/button>/g,
  `<button onClick={() => isReady ? window.print() : setShowValidationDrawer(true)} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-pointer border-transparent'}\`}>
                <FileText className="w-4 h-4" /> Export PDF
              </button>`
);

code = code.replace(
  /<button onClick=\{\(\) => !isReady && setShowValidationDrawer\(true\)\} className=\{\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \$\{isReady \? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-pointer border-transparent'\}\`\}>\n\s*<Download className="w-4 h-4" \/> Export DOCX\n\s*<\/button>/g,
  `<button onClick={() => isReady ? window.print() : setShowValidationDrawer(true)} className={\`px-4 py-2 flex items-center gap-2 rounded font-medium transition-colors \${isReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-pointer border-transparent'}\`}>
                <Download className="w-4 h-4" /> Export DOCX
              </button>`
);


fs.writeFileSync('src/enterprise/workspace/preview/KspPreviewWorkspace.tsx', code);
console.log("Patched KspPreviewWorkspace PDF");
