const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/ksp/KspMetadataAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('rawCharacteristics?: any;')) {
  content = content.replace(
    "rawStudents?: any;",
    "rawStudents?: any;\n  rawCharacteristics?: any;"
  );

  content = content.replace(
    "rawStudents: settings?.pesertaDidik ? {",
    "rawCharacteristics: settings?.karakteristik || undefined,\n      rawStudents: settings?.pesertaDidik ? {"
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspMetadataAdapter.ts");
}
