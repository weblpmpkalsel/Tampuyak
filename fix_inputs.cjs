const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(/FormInput/g, 'Input');
code = code.replace(/FormSelect/g, 'Select');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed FormInput/FormSelect');
