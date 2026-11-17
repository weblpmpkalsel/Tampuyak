const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
code = code.replace('<ApprovalsView />', "<ApprovalsView onClose={() => setCurrentView('dashboard')} />");
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done');
