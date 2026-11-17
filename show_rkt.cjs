const fs = require('fs');
let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf-8').split('\\n');
// get lines from RKTDerivationView to handleSync
let startIdx = lines.findIndex(l => l.includes('const RKTDerivationView ='));
let endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('const handleSync ='));
console.log(lines.slice(startIdx, endIdx).join('\\n'));
