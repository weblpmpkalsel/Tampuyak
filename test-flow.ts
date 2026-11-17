import { EnterpriseAdapter } from './src/enterprise/workspace/adapters/EnterpriseAdapter';
import { KspMetadataAdapter } from './src/ksp/KspMetadataAdapter';
import { assembleKspDocument } from './src/enterprise/document/ksp/KspDocumentAssembler';

const rawSettings = {
  academicCalendar: {
    events: [
      { id: "e1", date: "2026-07-15", name: "Hari Pertama Masuk", type: "Academic" }
    ],
    effectiveWeeks: 38,
    effectiveLearningDays: 190
  },
  extracurricular: {
    mandatoryPrograms: [
      { id: "mp1", name: "Pramuka", description: "Wajib untuk semua" }
    ]
  },
  academicYears: [{ name: "2026/2027", isActive: true }]
};

const metadata = KspMetadataAdapter.adapt(rawSettings);
console.log("Metadata Raw Extracurricular:", metadata.rawExtracurricular);
console.log("Metadata Raw Calendar:", metadata.rawAcademicCalendar);

const doc = assembleKspDocument(metadata);
const bab3 = doc.sections.find(s => s.chapterId === 'BAB_III');
console.log("BAB 3 Blocks related to Ex/Cal:");
const exHeading = bab3.blocks.find(b => b.type === 'HEADING' && b.nodes[0].text === 'E. Ekstrakurikuler');
const calHeading = bab3.blocks.find(b => b.type === 'HEADING' && b.nodes[0].text === 'F. Kalender Akademik');
console.log("Ex Heading exists?", !!exHeading);
console.log("Cal Heading exists?", !!calHeading);
if (bab3.blocks.find(b => b.id === 'bab3-table-extracurricular')) {
  console.log("Ex Table exists");
}
