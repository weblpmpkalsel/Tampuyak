const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/bab3/KspBab3Structure.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { AcademicCalendarKnowledge } from '../../../knowledge/builders/AcademicCalendarBuilder';",
  "import { AcademicCalendarKnowledge } from '../../../knowledge/builders/AcademicCalendarBuilder';\nimport { LearningLoadKnowledge } from '../../../knowledge/models/curriculum/LearningLoadKnowledge';"
);

content = content.replace(
  "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {",
  "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {"
);

const learningLoadBlock = `
  if (learningLoadPayload) {
    blocks.push({
      id: 'bab3-heading-beban-belajar',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-beban-belajar', type: 'TEXT', text: 'Beban Belajar' }]
    });

    blocks.push({
      id: 'bab3-paragraph-beban-belajar-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-beban-belajar-1',
        type: 'TEXT',
        text: \`Beban belajar untuk \${learningLoadPayload.payload.educationLevel} \${learningLoadPayload.payload.phase} pada tahun ajaran \${learningLoadPayload.payload.academicYear} dirancang untuk mengoptimalkan potensi peserta didik sesuai dengan tahapan perkembangan dan tingkat pendidikannya.\`
      }]
    });

    blocks.push({
      id: 'bab3-paragraph-beban-belajar-2',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-beban-belajar-2',
        type: 'TEXT',
        text: \`Beban belajar mencakup muatan pembelajaran yang diuraikan dengan rinci. Alokasi waktu pembelajaran disusun dengan mempertimbangkan efektivitas pencapaian kompetensi. Dalam satu tahun ajaran, terdapat \${learningLoadPayload.payload.effectiveWeeks} minggu efektif. Beban belajar per minggu adalah \${learningLoadPayload.payload.weeklyLearningLoad} Jam Pelajaran (JP), yang ekuivalen dengan total \${learningLoadPayload.payload.annualLearningLoad} JP per tahun. Total jam pembelajaran efektif yang direncanakan adalah \${learningLoadPayload.payload.totalLearningHours} JP.\`
      }]
    });
  }
`;

content = content.replace(
  "// Note: According to D1.0, we DO NOT implement Learning Load, Intracurricular, Kokurikuler, Extracurricular.",
  learningLoadBlock + "\n  // Note: According to D1.0, we DO NOT implement Intracurricular, Kokurikuler, Extracurricular."
);

fs.writeFileSync(file, content);
console.log("Updated KspBab3Structure.ts");
