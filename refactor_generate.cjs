const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /v1\.0 \(Generated\)/g,
    'v1.0 (Dibuat)'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
