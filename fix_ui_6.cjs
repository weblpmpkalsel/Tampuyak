const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(/bg-gradient-to-br from-blue-600 to-blue-600/g, 'bg-blue-700');
code = code.replace(/bg-gradient-to-br from-blue-500 to-blue-600/g, 'bg-blue-700');
code = code.replace(/shadow-lg shadow-blue-500\/30/g, 'shadow-md');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 6');
