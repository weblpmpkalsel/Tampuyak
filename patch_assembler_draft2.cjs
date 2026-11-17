const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

content = content.replace(/lifecycle: 'GENERATED'/g, "lifecycle: 'Draft'");
fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', content);
console.log('patched GENERATED to Draft');
