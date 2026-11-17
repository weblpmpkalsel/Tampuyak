import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/Reviewed/g, 'Diperiksa');
content = content.replace(/>Remaining</g, '>Sisa<');
content = content.replace(/>Pass</g, '>Lolos<');
content = content.replace(/>Fail\/Warn</g, '>Gagal/Peringatan<');
content = content.replace(/>Critical: /g, '>Kritis: ');
content = content.replace(/>High: /g, '>Tinggi: ');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed QA texts');
