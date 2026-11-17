import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/>Upload /g, '>Unggah ');
content = content.replace(/> Export QA Findings/g, '> Unduh Hasil Pemeriksaan');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed export/upload texts');
