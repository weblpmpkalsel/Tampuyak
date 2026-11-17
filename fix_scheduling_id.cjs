const fs = require('fs');

const file = 'src/modules/supervision/ui/SupervisionScheduling.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { v4 as uuidv4 } from 'uuid';")) {
  content = "import { v4 as uuidv4 } from 'uuid';\n" + content;
}

content = content.replace(/String\(Date.now\(\)\)/g, 'uuidv4()');
fs.writeFileSync(file, content);
