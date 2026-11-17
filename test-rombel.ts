import { buildStudentCharacteristicDomain } from './src/enterprise/knowledge/builders/SchoolContextBuilder';

const rawRombel = [
  { nama: "Class 1", siswa: 23 },
  { nama: "Class 2", siswa: 24 },
  { nama: "Class 3", siswa: 18 }
];

console.log(JSON.stringify(buildStudentCharacteristicDomain(undefined, rawRombel), null, 2));
