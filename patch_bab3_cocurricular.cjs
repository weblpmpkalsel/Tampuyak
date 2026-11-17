const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/bab3/KspBab3Structure.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('CocurricularKnowledge')) {
  content = content.replace(
    "import { IntracurricularKnowledge } from '../../../knowledge/models/curriculum/IntracurricularKnowledge';",
    "import { IntracurricularKnowledge } from '../../../knowledge/models/curriculum/IntracurricularKnowledge';\nimport { CocurricularKnowledge } from '../../../knowledge/models/curriculum/CocurricularKnowledge';"
  );

  content = content.replace(
    "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  learningOrganizationPayload?: LearningOrganizationKnowledge,\n  intracurricularPayload?: IntracurricularKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {",
    "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  learningOrganizationPayload?: LearningOrganizationKnowledge,\n  intracurricularPayload?: IntracurricularKnowledge,\n  cocurricularPayload?: CocurricularKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {"
  );

  const cocurricularBlock = `
  if (cocurricularPayload) {
    blocks.push({
      id: 'bab3-heading-cocurricular',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-cocurricular', type: 'TEXT', text: 'Kokurikuler' }]
    });

    blocks.push({
      id: 'bab3-paragraph-cocurricular-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-cocurricular-1',
        type: 'TEXT',
        text: \`\${cocurricularPayload.payload.programIdentity} dirancang untuk mencapai: \${cocurricularPayload.payload.objectives}\`
      }]
    });

    if (cocurricularPayload.payload.activities.length > 0) {
      const ccTableRows = cocurricularPayload.payload.activities.map((act, idx) => {
        return {
          id: \`bab3-table-row-cc-\${idx}\`,
          type: 'TABLE_ROW',
          cells: [
            { id: \`bab3-tc-cc-1-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-cc-1-\${idx}\`, type: 'TEXT', text: act.activityName }] },
            { id: \`bab3-tc-cc-2-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-cc-2-\${idx}\`, type: 'TEXT', text: act.targetPhase }] },
            { id: \`bab3-tc-cc-3-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-cc-3-\${idx}\`, type: 'TEXT', text: act.implementationTime }] },
            { id: \`bab3-tc-cc-4-\${idx}\`, type: 'TABLE_CELL', nodes: [{ id: \`bab3-t-cc-4-\${idx}\`, type: 'TEXT', text: act.description }] }
          ]
        };
      });

      blocks.push({
        id: 'bab3-table-cocurricular',
        type: 'TABLE',
        head: [
          {
            id: 'bab3-table-head-cc',
            type: 'TABLE_ROW',
            cells: [
              { id: 'bab3-tc-cc-h1', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h1', type: 'TEXT', text: 'Nama Kegiatan' }] },
              { id: 'bab3-tc-cc-h2', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h2', type: 'TEXT', text: 'Fase' }] },
              { id: 'bab3-tc-cc-h3', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h3', type: 'TEXT', text: 'Waktu Pelaksanaan' }] },
              { id: 'bab3-tc-cc-h4', type: 'TABLE_CELL', nodes: [{ id: 'bab3-t-cc-h4', type: 'TEXT', text: 'Deskripsi' }] }
            ]
          }
        ],
        body: ccTableRows
      } as any);
    }
    
    blocks.push({
      id: 'bab3-paragraph-cocurricular-2',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-cocurricular-2',
        type: 'TEXT',
        text: \`Asesmen: \${cocurricularPayload.payload.assessment} Refleksi: \${cocurricularPayload.payload.reflection}\`
      }]
    });
  }
`;

  content = content.replace(
    "// Note: According to D1.0, we DO NOT implement Kokurikuler, Extracurricular.",
    cocurricularBlock + "\n  // Note: According to D1.0, we DO NOT implement Extracurricular."
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspBab3Structure.ts with CocurricularKnowledge");
}
