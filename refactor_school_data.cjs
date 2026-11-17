const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /settings\.namaSekolah/g,
    'settings.school?.name'
);

code = code.replace(
    /settings\.npsn/g,
    'settings.school?.npsn'
);

code = code.replace(
    /settings\.kepsek/g,
    'settings.principal'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
