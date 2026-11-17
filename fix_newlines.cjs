const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
code = code.replace(/\\n/g, '\\n');
fs.writeFileSync('src/Tampuyak.tsx', code);
