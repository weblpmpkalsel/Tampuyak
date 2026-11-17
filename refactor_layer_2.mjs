import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

for (let i = 1; i <= 9; i++) {
  content = content.replace(new RegExp(`Layer ${i}`, 'g'), `Tahap ${i}`);
  content = content.replace(new RegExp(`Layer ${i}-${i+2}`, 'g'), `Tahap ${i}-${i+2}`);
}

content = content.replace(/>Enterprise Quality Assurance & Certification</g, '>Pemeriksaan dan Sertifikasi Mutu Terpadu<');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Layer terms replaced');
