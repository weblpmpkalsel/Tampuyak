const fs = require('fs');
const code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const lines = code.split('\n');
const errors = lines
    .map((l, i) => ({ l: i + 1, c: l }))
    .filter(o => o.c.toLowerCase().includes('error'));

console.log(errors.slice(0, 20).map(o => `${o.l}: ${o.c}`).join('\n'));
