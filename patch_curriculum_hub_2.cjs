const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/enterprise/workspace/modules/CurriculumHubModule.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/updateSetting\('cocurricular', newKnowledge\.payload\)/g, "updateSetting('cocurricular', '', newKnowledge.payload)");
content = content.replace(/updateSetting\('intracurricular', newKnowledge\.payload\)/g, "updateSetting('intracurricular', '', newKnowledge.payload)");
content = content.replace(/updateSetting\('learningOrganization', newKnowledge\.payload\)/g, "updateSetting('learningOrganization', '', newKnowledge.payload)");

fs.writeFileSync(file, content);
console.log("Patched updateSetting arguments");
