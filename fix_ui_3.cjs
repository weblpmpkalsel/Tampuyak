const fs = require('fs');

const files = [
  'src/PusatPengetahuan.tsx', 
  'src/EducationalAuditExplorer.tsx', 
  'src/DocumentChapters.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    code = code.replace(/text-indigo/g, 'text-blue');
    code = code.replace(/bg-indigo/g, 'bg-blue');
    code = code.replace(/border-indigo/g, 'border-blue');
    code = code.replace(/ring-indigo/g, 'ring-blue');
    code = code.replace(/shadow-indigo/g, 'shadow-blue');

    code = code.replace(/rounded-2xl/g, 'rounded-md');
    code = code.replace(/rounded-xl/g, 'rounded-md');
    code = code.replace(/rounded-lg/g, 'rounded-md');
    code = code.replace(/rounded-full/g, 'rounded');
    
    code = code.replace(/text-\[10px\]/g, 'text-xs');
    code = code.replace(/text-\[9px\]/g, 'text-xs');
    code = code.replace(/text-\[11px\]/g, 'text-sm');

    fs.writeFileSync(file, code);
  }
});
console.log('Done script 3');
