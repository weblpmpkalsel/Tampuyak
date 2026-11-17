import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { buildStudentCharacteristicDomain } from './src/enterprise/knowledge/builders/SchoolContextBuilder';

const rawSettings = {
  rombel: [
    { nama: "Class 1", siswa: 23 },
    { nama: "Class 2", siswa: 24 },
    { nama: "Class 3", siswa: 18 }
  ]
};

console.log("=== 1. settings.rombel ===");
console.log(JSON.stringify(rawSettings.rombel, null, 2));

const metadata = KspMetadataAdapter.adapt(rawSettings as any);
console.log("\n=== 2. Metadata Adapter (rawRombel) ===");
console.log(JSON.stringify(metadata.rawRombel, null, 2));

const studentProjection = buildStudentCharacteristicDomain(metadata.rawStudents, metadata.rawRombel);
console.log("\n=== 3. Student Projection ===");
console.log(JSON.stringify(studentProjection, null, 2));

