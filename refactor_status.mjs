import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const replacements = [
  ['Draft', 'Draf'],
  ['Review', 'Tinjauan'],
  ['Approved', 'Disetujui'],
  ['Complete', 'Lengkap'],
  ['Partial', 'Sebagian'],
  ['Pending', 'Menunggu']
];

for (const [en, id] of replacements) {
  content = content.replace(new RegExp(`'${en}'`, 'g'), `'${id}'`);
  content = content.replace(new RegExp(`"${en}"`, 'g'), `"${id}"`);
  content = content.replace(new RegExp(`>${en}<`, 'g'), `>${id}<`);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Done');
