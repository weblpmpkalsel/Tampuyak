import { Chapter4Builder } from './src/DocumentCompositionEngine/builders/Chapter4Builder.ts';

const objectives = [
  { id: '1', strategicObjective: 'Program 1' },
  { id: '2', strategicObjective: 'Program 2' },
  { id: '3', strategicObjective: 'Program 3' },
  { id: '4', strategicObjective: 'Program 4' }
];

const annualPlans = {
  "Y1": {
    rkt: [{ id: 'RKT-Y1-1', rkjmObjectiveId: '1', activity: 'Program 1', target: 'Guru', schedule: 'Januari' }],
    rkas: [{ id: 'RKAS-Y1-1', rktActivityId: 'RKT-Y1-1', budgetItem: 'Biaya 1', amount: 1000 }]
  },
  "Y2": {
    rkt: [{ id: 'RKT-Y2-2', rkjmObjectiveId: '2', activity: 'Program 2', target: 'Guru', schedule: 'Januari' }],
    rkas: [{ id: 'RKAS-Y2-2', rktActivityId: 'RKT-Y2-2', budgetItem: 'Biaya 2', amount: 1000 }]
  },
  "Y3": {
    rkt: [{ id: 'RKT-Y3-3', rkjmObjectiveId: '3', activity: 'Program 3', target: 'Guru', schedule: 'Januari' }],
    rkas: [{ id: 'RKAS-Y3-3', rktActivityId: 'RKT-Y3-3', budgetItem: 'Biaya 3', amount: 1000 }]
  },
  "Y4": {
    rkt: [{ id: 'RKT-Y4-4', rkjmObjectiveId: '4', activity: 'Program 4', target: 'Guru', schedule: 'Januari' }],
    rkas: [{ id: 'RKAS-Y4-4', rktActivityId: 'RKT-Y4-4', budgetItem: 'Biaya 4', amount: 1000 }]
  }
};

const builder = new Chapter4Builder();
const output = builder.build({ objectives, annualPlans });

console.log("=== Peta Jalan Implementasi ===");
const peta = output.sections.find(s => s.title === '4.2 Peta Jalan Implementasi');
console.log(JSON.stringify(peta?.content.find(c => c.type === 'table'), null, 2));

console.log("\n=== Rencana Kerja Tahunan (RKT) ===");
const rkt = output.sections.find(s => s.title === '4.3 Rencana Kerja Tahunan (RKT)');
console.log(JSON.stringify(rkt?.content.find(c => c.type === 'table'), null, 2));

console.log("\n=== Proyeksi Anggaran (RKAS) ===");
const rkas = output.sections.find(s => s.title === '4.4 Proyeksi Anggaran (RKAS)');
console.log(JSON.stringify(rkas?.content.find(c => c.type === 'table'), null, 2));
