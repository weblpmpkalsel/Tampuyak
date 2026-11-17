import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/Module under development\.\.\./g, 'Modul sedang dalam pengembangan...');
content = content.replace(/All required datasets and coverage checks have been verified\./g, 'Semua data dan pemeriksaan telah diverifikasi.');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed dev module texts');
