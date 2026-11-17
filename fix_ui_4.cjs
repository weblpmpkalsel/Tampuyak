const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Button component updates
code = code.replace(/px-4 py-2\.5 text-\[15px\]/g, 'px-5 py-3 text-base');

// Inputs/Select/Textarea component updates
code = code.replace(/text-\[13px\]/g, 'text-sm');
code = code.replace(/text-\[15px\]/g, 'text-base');
code = code.replace(/py-2\.5 bg-white border rounded text-base/g, 'py-3 px-4 bg-white border rounded text-base');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 4');
