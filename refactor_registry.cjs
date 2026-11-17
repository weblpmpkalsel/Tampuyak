const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /Generator dokumen membaca struktur langsung/g,
    'Sistem pembuat dokumen membaca struktur langsung'
);

code = code.replace(
    />\s*Phase \d+\.\d+\s*</g,
    '>Registry<'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
