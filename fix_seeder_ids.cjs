const fs = require('fs');
const file = 'src/modules/supervision/persistence/firestore/SupervisionSeeder.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { v4 as uuidv4 } from 'uuid';")) {
  content = "import { v4 as uuidv4 } from 'uuid';\n" + content;
}

content = content.replace(/'INS-001'/g, 'uuidv4()');
content = content.replace(/'CAT-1'/g, 'cat1Id');
content = content.replace(/'CAT-2'/g, 'cat2Id');
content = content.replace(/'ITEM-1'/g, 'uuidv4()');
content = content.replace(/'ITEM-2'/g, 'uuidv4()');

// We need to inject const cat1Id = uuidv4(); etc before MOCK_INSTRUMENT
if (!content.includes('const cat1Id')) {
  content = content.replace(
    'const DEFAULT_INSTRUMENT: SupervisionInstrument = {',
    'const cat1Id = uuidv4();\nconst cat2Id = uuidv4();\n\nconst DEFAULT_INSTRUMENT: SupervisionInstrument = {'
  );
}

fs.writeFileSync(file, content);
