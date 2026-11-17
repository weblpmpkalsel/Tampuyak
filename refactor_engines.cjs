const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regexReplacements = [
    [/>\s*Workflow & Approval Engine\s*</g, '>Status & Persetujuan Dokumen<'],
    [/>\s*Document Standard Engine\s*</g, '>Standar Format Dokumen<'],
    [/>\s*RKJM Blueprint Engine\s*</g, '>Struktur Perencanaan RKJM<'],
    [/>\s*Language Engine\s*</g, '>Sistem Bahasa<'],
    [/>\s*Engine\s*</g, '>Sistem<']
];

for (const [regex, replacement] of regexReplacements) {
    code = code.replace(regex, replacement);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
