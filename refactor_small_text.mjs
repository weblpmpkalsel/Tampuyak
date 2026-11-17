import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/text-\[10px\]/g, 'text-xs');
content = content.replace(/text-\[11px\]/g, 'text-xs');
content = content.replace(/text-\[12px\]/g, 'text-xs');
// And ensure there's no `text-xs` mapping to 12px natively anymore since I updated index.css 

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Replaced small text sizes');
