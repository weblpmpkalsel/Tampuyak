import { v4 as uuidv4 } from 'uuid';
import { FirestoreInstrumentRepository } from './FirestoreInstrumentRepository';
import { SupervisionInstrument, SupervisionStatus } from '../../types/SupervisionTypes';

const cat1Id = uuidv4();
const cat2Id = uuidv4();

const DEFAULT_INSTRUMENT: SupervisionInstrument = {
  id: uuidv4(),
  name: 'Instrumen Observasi Pembelajaran Abad 21',
  status: SupervisionStatus.COMPLETED,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  categories: [
    {
      id: cat1Id,
      name: 'Kegiatan Pendahuluan',
      weight: 20
    },
    {
      id: cat2Id,
      name: 'Kegiatan Inti',
      weight: 60
    }
  ],
  items: [
    {
      id: uuidv4(),
      categoryId: cat1Id,
      description: 'Guru melakukan apersepsi dan mengaitkan materi dengan pengalaman murid',
      maxScore: 100
    },
    {
      id: uuidv4(),
      categoryId: cat2Id,
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
    await repo.create(DEFAULT_INSTRUMENT);
  } else {
    console.log("Instruments already exist. Skipping seed.");
  }
}
