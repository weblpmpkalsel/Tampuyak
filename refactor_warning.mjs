import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/>Direview</g, '>Ditinjau<');
content = content.replace(/>Preview</g, '>Pratinjau<');
content = content.replace(/>WARNING</g, '>PERINGATAN<');
content = content.replace(/>Warning</g, '>Peringatan<');
content = content.replace(/Blocker atau Warning/g, 'Kendala atau Peringatan');
content = content.replace(/> Smart Review Comments</g, '> Catatan Tinjauan Cerdas<');
content = content.replace(/>Data Integrity Error: /g, '>Kesalahan Data: ');
content = content.replace(/>Enterprise Review Passed</g, '>Tinjauan Selesai<');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed Warning/Error texts');
