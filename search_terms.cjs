const fs = require('fs');
const content = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const matches = [
  ...content.matchAll(/Generate with AI/gi),
  ...content.matchAll(/AI Engine/gi),
  ...content.matchAll(/Blueprint/gi),
  ...content.matchAll(/Pipeline/gi),
  ...content.matchAll(/Assembly/gi),
  ...content.matchAll(/Generator/gi),
  ...content.matchAll(/Publishing/gi)
];

const counts = {};
for (const match of matches) {
  counts[match[0]] = (counts[match[0]] || 0) + 1;
}

console.log(counts);
