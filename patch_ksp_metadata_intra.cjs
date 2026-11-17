const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/ksp/KspMetadataAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('rawIntracurricular?: any;')) {
  content = content.replace(
    "rawLearningOrganization?: any;",
    "rawLearningOrganization?: any;\n  rawIntracurricular?: any;"
  );
  
  content = content.replace(
    "rawLearningOrganization: settings?.learningOrganization || undefined,",
    "rawLearningOrganization: settings?.learningOrganization || undefined,\n      rawIntracurricular: settings?.intracurricular || undefined,"
  );
  
  fs.writeFileSync(file, content);
  console.log("Updated KspMetadataAdapter.ts with rawIntracurricular");
}
