const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    />Decision Engine</g,
    '>Sistem Keputusan<'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
