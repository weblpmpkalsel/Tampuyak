const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
    /block\.type === "AI"/g,
    'block.type === "AI"' // Keep logic, but change UI text
);

code = code.replace(
    /Perbarui dari\s*AI/g,
    'Perbarui dari Sistem'
);

code = code.replace(
    /Perubahan manual ini tidak akan ditimpa oleh AI\./g,
    'Perubahan manual ini tidak akan ditimpa oleh sistem.'
);

code = code.replace(
    /> AI</g,
    '> Writing Assistant<'
);

code = code.replace(
    /operasional oleh AI\./g,
    'operasional oleh sistem.'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
