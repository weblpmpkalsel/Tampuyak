const fs = require('fs');

function replaceFile(path, searchRegex, replaceWith) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(searchRegex, replaceWith);
  fs.writeFileSync(path, code);
}

replaceFile('src/enterprise/document/library/components/EnterpriseDocumentCard.tsx', 
  /new Date\(document\.updatedAt\)\.toLocaleDateString\(\)/g, 
  "new Date(document.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })");

replaceFile('src/RKTDocument/ApprovalBuilder.ts', 
  /\.toLocaleDateString\('id-ID'\)/g, 
  ".toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })");

replaceFile('src/Tampuyak.tsx', 
  /\.toLocaleDateString\("id-ID"\)/g, 
  ".toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })");

console.log('Done');
