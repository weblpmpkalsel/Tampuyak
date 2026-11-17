const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/ksp/KspMetadataAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('rawCocurricular?: any;')) {
  content = content.replace(
    "rawIntracurricular?: any;",
    "rawIntracurricular?: any;\n  rawCocurricular?: any;"
  );
  
  content = content.replace(
    "rawIntracurricular: settings?.intracurricular || undefined,",
    "rawIntracurricular: settings?.intracurricular || undefined,\n      rawCocurricular: settings?.cocurricular || undefined,"
  );
  
  fs.writeFileSync(file, content);
  console.log("Updated KspMetadataAdapter.ts with rawCocurricular");
}
