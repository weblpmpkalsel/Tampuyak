const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    />RKJM Blueprint Engine</g,
    '>Struktur Perencanaan RKJM<'
);
code = code.replace(
    /Asistenerator/g,
    'Sistem Pembuat Dokumen'
);
code = code.replace(
    /Document Engine/g,
    'Sistem Dokumen'
);
code = code.replace(
    />\s*Document Editor\s*</g,
    '>Editor Dokumen<'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
