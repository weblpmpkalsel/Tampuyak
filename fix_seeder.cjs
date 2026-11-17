const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/persistence/firestore/SupervisionSeeder.ts', 'utf8');

content = content.replace(
  "status: 'PUBLISHED',",
  "status: SupervisionStatus.COMPLETED,"
);

if (!content.includes('SupervisionStatus')) {
  content = content.replace(
    "import { SupervisionInstrument } from '../../types/SupervisionTypes';",
    "import { SupervisionInstrument, SupervisionStatus } from '../../types/SupervisionTypes';"
  );
}

fs.writeFileSync('src/modules/supervision/persistence/firestore/SupervisionSeeder.ts', content);
console.log('Fixed seeder status enum');
