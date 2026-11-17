const fs = require('fs');

let content = fs.readFileSync('src/enterprise/document/ksp/cover/KspCoverStructure.ts', 'utf8');

// Remove the space paragraphs: cover-space-before-logo, cover-space-before-identity, cover-space-before-address, cover-space-before-footer

const blockPattern = /\s*\/\/\s*Space before[^]*?blocks\.push\(\{[^]*?id:\s*'cover-space-[^]*?\}\);/g;

content = content.replace(blockPattern, '');

fs.writeFileSync('src/enterprise/document/ksp/cover/KspCoverStructure.ts', content);
console.log('removed manual space blocks');
