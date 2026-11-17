const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionApplicationService.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { v4 as uuidv4 } from 'uuid';")) {
  content = "import { v4 as uuidv4 } from 'uuid';\n" + content;
}

content = content.replace(
  /private generateId\(\): string \{[^}]+\}/,
  "private generateId(): string {\n    return uuidv4();\n  }"
);
fs.writeFileSync(file, content);
