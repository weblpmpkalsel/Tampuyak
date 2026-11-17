const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/persistence/firestore/SupervisionSeeder.ts', 'utf8');

if (!content.includes('SupervisionStatus')) {
    // This shouldn't happen based on the previous script, but let's force the replacement safely
}
// Actually let's just rewrite the whole file cleanly to be sure it's perfect
content = `import { FirestoreInstrumentRepository } from './FirestoreInstrumentRepository';
import { SupervisionInstrument, SupervisionStatus } from '../../types/SupervisionTypes';

const MOCK_INSTRUMENT: SupervisionInstrument = {
  id: 'INS-001',
  name: 'Instrumen Observasi Pembelajaran Abad 21',
  status: SupervisionStatus.COMPLETED,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  categories: [
    {
      id: 'CAT-1',
      name: 'Kegiatan Pendahuluan',
      weight: 20
    },
    {
      id: 'CAT-2',
      name: 'Kegiatan Inti',
      weight: 60
    }
  ],
  items: [
    {
      id: 'ITEM-1',
      categoryId: 'CAT-1',
      description: 'Guru melakukan apersepsi dan mengaitkan materi dengan pengalaman murid',
      maxScore: 100
    },
    {
      id: 'ITEM-2',
      categoryId: 'CAT-2',
      description: 'Guru menerapkan pembelajaran berdiferensiasi',
      maxScore: 100
    }
  ]
};

export async function seedInstruments() {
  const repo = new FirestoreInstrumentRepository();
  const existing = await repo.findAll();
  
  if (existing.length === 0) {
    console.log("Seeding default instruments...");
    await repo.create(MOCK_INSTRUMENT);
  } else {
    console.log("Instruments already exist. Skipping seed.");
  }
}
`;

fs.writeFileSync('src/modules/supervision/persistence/firestore/SupervisionSeeder.ts', content);
console.log('Fixed seeder imports');
