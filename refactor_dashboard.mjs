import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/>Kembali ke Dashboard</g, '>Kembali ke Beranda<');
content = content.replace(/>Dashboard</g, '>Beranda<');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed Dashboard text');
