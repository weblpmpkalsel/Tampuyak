const fs = require('fs');

const files = [
  'src/Tampuyak.tsx', 
  'src/PusatPengetahuan.tsx', 
  'src/EducationalAuditExplorer.tsx', 
  'src/DocumentChapters.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    // Increase text contrast for lighter slate colors
    code = code.replace(/text-slate-500/g, 'text-slate-600');
    code = code.replace(/text-slate-400/g, 'text-slate-500');
    
    // Same for some borders
    code = code.replace(/border-slate-200/g, 'border-slate-300');
    code = code.replace(/border-slate-100/g, 'border-slate-200');

    fs.writeFileSync(file, code);
  }
});
console.log('Done script 5');
