import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/>Source Module</g, '>Modul Sumber<');
content = content.replace(/>Recommended Action</g, '>Rekomendasi Tindakan<');
content = content.replace(/Missing required datasets:/g, 'Data yang belum lengkap:');
content = content.replace(/Recommendation: Complete the missing data sections before exporting./g, 'Saran Perbaikan: Lengkapi data yang kurang sebelum mengunduh dokumen.');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Text replaced');
