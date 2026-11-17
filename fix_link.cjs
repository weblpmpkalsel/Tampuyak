const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');
code = code.replace(/<LinkIcon/g, '<Link');
fs.writeFileSync('src/Tampuyak.tsx', code);
