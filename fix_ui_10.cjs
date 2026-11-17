const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// DashboardView buttons cleanup
code = code.replace(/className="bg-blue-700 text-white hover:bg-blue-800 font-semibold rounded px-5 py-2\.5 shadow-sm text-sm"/g, 'className="shadow-sm"');
code = code.replace(/className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded px-5 py-2\.5 text-sm bg-white"/g, 'className="shadow-sm"');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 10');
