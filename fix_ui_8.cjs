const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Fix WorkspaceAnalisisView card colors
code = code.replace(/className=\{`w-12 h-12 rounded-md bg-\$\{doc\.color\}-50 flex items-center justify-center group-hover:scale-110 transition-transform`\}/g, 
  'className={`w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform`}');

code = code.replace(/className=\{`w-6 h-6 text-\$\{doc\.color\}-500`\} \/>/g, 
  'className={`w-6 h-6 text-blue-600`} />');

// Fix DokumenPerencanaanView card colors
code = code.replace(/className=\{`w-12 h-12 rounded-md flex items-center justify-center mb-4 bg-\$\{doc\.color\}-50 text-\$\{doc\.color\}-600`\}/g,
  'className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 bg-slate-100 text-slate-700`}');

code = code.replace(/className=\{`w-full bg-\$\{doc\.color\}-600 text-white hover:bg-\$\{doc\.color\}-700`\}/g,
  'className={`w-full bg-white text-blue-700 hover:bg-blue-50 border border-blue-200`}');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 8');
