const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/ksp/KspMetadataAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('rawLearningOrganization?: any;')) {
  content = content.replace(
    "rawLearningLoad?: any;",
    "rawLearningLoad?: any;\n  rawLearningOrganization?: any;"
  );
  
  content = content.replace(
    "rawLearningLoad: settings?.learningLoad || undefined,",
    "rawLearningLoad: settings?.learningLoad || undefined,\n      rawLearningOrganization: settings?.learningOrganization || undefined,"
  );
  
  fs.writeFileSync(file, content);
  console.log("Updated KspMetadataAdapter.ts with rawLearningOrganization");
}
