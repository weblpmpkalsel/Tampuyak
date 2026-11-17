const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

content = content.replace(/lifecycle: 'DRAFT'/g, "lifecycle: 'GENERATED'");
fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', content);
console.log('patched DRAFT to GENERATED');
