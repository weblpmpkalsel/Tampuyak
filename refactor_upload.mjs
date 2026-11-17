import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/>Import Excel</g, '>Unggah Excel<');
content = content.replace(/Konfirmasi & Simpan Impor/g, 'Konfirmasi & Simpan');
content = content.replace(/>Tanggal Impor</g, '>Tanggal Unggah<');
content = content.replace(/Diimpor oleh/g, 'Diunggah oleh');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed more upload texts');
