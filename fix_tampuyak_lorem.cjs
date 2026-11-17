const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(/Ditemukan teks placeholder \(Lorem Ipsum\) pada/g, 'Ditemukan teks sementara (isian belum lengkap) pada');
code = code.replace(/Ditemukan placeholder \[NAMA SEKOLAH\] pada/g, 'Ditemukan isian [NAMA SEKOLAH] yang belum dilengkapi pada');
code = code.replace(/\{(\/\* Body Content Dummy \*\/)\}/g, '');
code = code.replace(/Mengisi placeholder identitas/g, 'Melengkapi identitas');
code = code.replace(/Mengisi semua placeholder dokumen/g, 'Melengkapi semua isian dokumen');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
