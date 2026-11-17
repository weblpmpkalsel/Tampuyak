const fs = require('fs');
const files = [
  'FirestoreScheduleRepository.ts',
  'FirestoreObservationRepository.ts',
  'FirestoreInstrumentRepository.ts',
  'FirestorePostObservationRepository.ts',
  'FirestoreFollowUpRepository.ts'
];

for (const file of files) {
  const path = 'src/modules/supervision/persistence/firestore/' + file;
  let content = fs.readFileSync(path, 'utf8');
  
  if (!content.includes('async create(')) {
    // Need to get the type T from the class definition
    // e.g. class FirestoreScheduleRepository extends FirestoreBaseRepository<SupervisionSchedule>
    const match = content.match(/extends FirestoreBaseRepository<(.+?)>/);
    if (match) {
      const type = match[1];
      const createMethod = `\n  async create(data: ${type}): Promise<${type}> {\n    return this._create(data);\n  }\n`;
      content = content.replace('constructor() {', createMethod + '\n  constructor() {');
      fs.writeFileSync(path, content);
      console.log('Added create to', file);
    }
  }
}

// And update FirestoreSupervisionRepository to use this._create instead of super.create
let supContent = fs.readFileSync('src/modules/supervision/persistence/firestore/FirestoreSupervisionRepository.ts', 'utf8');
supContent = supContent.replace('await super.create(plan as any);', 'await this._create(plan);');
fs.writeFileSync('src/modules/supervision/persistence/firestore/FirestoreSupervisionRepository.ts', supContent);
console.log('Fixed FirestoreSupervisionRepository.ts');

