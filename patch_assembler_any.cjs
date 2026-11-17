const fs = require('fs');
let content = fs.readFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', 'utf8');

const search = `    academicYear: {
      metadata: { id: '', version: '1.0', owner: '', lifecycle: 'Draft' },`;
const replace = `    academicYear: {
      metadata: { id: '', version: '1.0', owner: '', lifecycle: 'Draft' },
      validation: {} as any,`;

content = content.replace(search, replace);
fs.writeFileSync('src/enterprise/document/ksp/KspDocumentAssembler.ts', content);
console.log('Patched KspDocumentAssembler.ts');
