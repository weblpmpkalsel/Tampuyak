import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/>Selesai \(Draft\)</g, '>Selesai (Draf)<');
content = content.replace(/>✓ DRAFT READY</g, '>✓ DRAF SIAP<');
content = content.replace(/>⚠ BLOCKING ISSUES</g, '>⚠ TERDAPAT KENDALA<');
content = content.replace(/>DRAFT</g, '>DRAF<');
content = content.replace(/Simpan Draft/g, 'Simpan Draf');
content = content.replace(/Draft berhasil disimpan/g, 'Draf berhasil disimpan');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed Draft texts');
