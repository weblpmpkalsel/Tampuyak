const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/bab3/KspBab3Structure.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('IntracurricularKnowledge')) {
  content = content.replace(
    "import { LearningOrganizationKnowledge } from '../../../knowledge/models/curriculum/LearningOrganizationKnowledge';",
    "import { LearningOrganizationKnowledge } from '../../../knowledge/models/curriculum/LearningOrganizationKnowledge';\nimport { IntracurricularKnowledge } from '../../../knowledge/models/curriculum/IntracurricularKnowledge';"
  );

  content = content.replace(
    "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  learningOrganizationPayload?: LearningOrganizationKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {",
    "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  learningOrganizationPayload?: LearningOrganizationKnowledge,\n  intracurricularPayload?: IntracurricularKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {"
  );

  const intraBlock = `
  if (intracurricularPayload && intracurricularPayload.payload.subjects.length > 0) {
    blocks.push({
      id: 'bab3-heading-intracurricular',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-intracurricular', type: 'TEXT', text: 'Intrakurikuler' }]
    });

    blocks.push({
      id: 'bab3-paragraph-intracurricular-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-intracurricular-1',
        type: 'TEXT',
        text: 'Kegiatan pembelajaran intrakurikuler dirancang untuk mencapai kompetensi peserta didik pada setiap mata pelajaran. Berikut adalah struktur mata pelajaran beserta alokasi waktu dan pendekatan yang digunakan:'
      }]
    });

    const tableRows = intracurricularPayload.payload.subjects.map((sub, idx) => {
      return {
        id: \`bab3-table-row-intra-\${idx}\`,
        type: 'TABLE_ROW',
        cells: [
          { id: \`bab3-tc-intra-1-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-intra-1-\${idx}\`, type: 'TEXT', text: sub.subjectName }] },
          { id: \`bab3-tc-intra-2-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-intra-2-\${idx}\`, type: 'TEXT', text: sub.phase }] },
          { id: \`bab3-tc-intra-3-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-intra-3-\${idx}\`, type: 'TEXT', text: sub.weeklyLearningHours.toString() }] },
          { id: \`bab3-tc-intra-4-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-intra-4-\${idx}\`, type: 'TEXT', text: sub.annualLearningHours.toString() }] },
          { id: \`bab3-tc-intra-5-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-intra-5-\${idx}\`, type: 'TEXT', text: sub.learningApproach }] }
        ]
      };
    });

    blocks.push({
      id: 'bab3-table-intracurricular',
      type: 'TABLE',
      head: [
        {
          id: 'bab3-table-head-intra',
          type: 'TABLE_ROW',
          cells: [
            { id: 'bab3-tc-intra-h1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h1', type: 'TEXT', text: 'Mata Pelajaran' }] },
            { id: 'bab3-tc-intra-h2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h2', type: 'TEXT', text: 'Fase' }] },
            { id: 'bab3-tc-intra-h3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h3', type: 'TEXT', text: 'JP/Minggu' }] },
            { id: 'bab3-tc-intra-h4', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h4', type: 'TEXT', text: 'JP/Tahun' }] },
            { id: 'bab3-tc-intra-h5', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-intra-h5', type: 'TEXT', text: 'Pendekatan' }] }
          ]
        }
      ],
      body: tableRows
    } as any);
  }
`;

  content = content.replace(
    "// Note: According to D1.0, we DO NOT implement Intracurricular, Kokurikuler, Extracurricular.",
    intraBlock + "\n  // Note: According to D1.0, we DO NOT implement Kokurikuler, Extracurricular."
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspBab3Structure.ts with IntracurricularKnowledge");
}
