const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/ksp/KspMetadataAdapter.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('rawLearningLoad?: any;')) {
  content = content.replace(
    "  draftingTeam?: readonly { name: string; role: string; identifier?: string }[];\n}",
    "  draftingTeam?: readonly { name: string; role: string; identifier?: string }[];\n  rawLearningLoad?: any;\n}"
  );
  
  content = content.replace(
    "rawStrategicPolicy: settings?.identitas ? {",
    "rawLearningLoad: settings?.learningLoad || undefined,\n      rawStrategicPolicy: settings?.identitas ? {"
  );
  
  fs.writeFileSync(file, content);
  console.log("Updated KspMetadataAdapter.ts");
}
