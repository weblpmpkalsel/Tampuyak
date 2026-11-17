const fs = require('fs');
let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf-8').split('\\n');

// 12158 to 12183 are lines (1-indexed). So we splice from 12157, 26 lines
lines.splice(12157, 26);

fs.writeFileSync('src/Tampuyak.tsx', lines.join('\\n'));
console.log("Fixed lines 12158-12183");
