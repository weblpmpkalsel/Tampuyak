import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { buildStudentCharacteristicDomain } from './src/enterprise/knowledge/builders/SchoolContextBuilder';
import { buildKspBab1Section } from './src/enterprise/document/ksp/bab1/KspBab1Structure';

const rawSettings = {
  rombel: [
    { nama: "Class 1", siswa: 23 },
    { nama: "Class 2", siswa: 24 },
    { nama: "Class 3", siswa: 18 }
  ]
};

console.log("=== 1. settings.rombel ===");
console.log(JSON.stringify(rawSettings.rombel, null, 2));

console.log("\n=== 2. Metadata Adapter (rawRombel) ===");
// Mocking the adapter since we only care about rawRombel mapping
const adapterOutput = { rawRombel: rawSettings.rombel };
console.log(JSON.stringify(adapterOutput.rawRombel, null, 2));

console.log("\n=== 3. Student Projection ===");
const studentProjection = buildStudentCharacteristicDomain(undefined, adapterOutput.rawRombel);
console.log(JSON.stringify(studentProjection, null, 2));

console.log("\n=== 4. Canonical AST ===");
const bab1 = buildKspBab1Section({
  students: studentProjection,
  profile: { schoolName: 'Test School' }
} as any);

const tableNode = bab1.blocks.find(b => b.type === 'TABLE' && b.id === 'bab1-table-12');
console.log(JSON.stringify(tableNode, null, 2));

