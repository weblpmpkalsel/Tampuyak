import fs from 'fs';
const files = ['src/MasterData.ts', 'src/Tampuyak.tsx'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/Kemendiknas/g, 'Kemendikdasmen');
  fs.writeFileSync(f, content);
});
console.log('Replaced Kemendiknas');
