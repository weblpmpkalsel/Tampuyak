const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/bab3/KspBab3Structure.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningOrganizationKnowledge')) {
  content = content.replace(
    "import { LearningLoadKnowledge } from '../../../knowledge/models/curriculum/LearningLoadKnowledge';",
    "import { LearningLoadKnowledge } from '../../../knowledge/models/curriculum/LearningLoadKnowledge';\nimport { LearningOrganizationKnowledge } from '../../../knowledge/models/curriculum/LearningOrganizationKnowledge';"
  );

  content = content.replace(
    "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {",
    "export function buildKspBab3Section(\n  structurePayload: CurriculumStructureKnowledge, \n  learningLoadPayload?: LearningLoadKnowledge,\n  learningOrganizationPayload?: LearningOrganizationKnowledge,\n  calendarPayload?: AcademicCalendarKnowledge\n): DocumentSection {"
  );

  const loBlock = `
  if (learningOrganizationPayload) {
    blocks.push({
      id: 'bab3-heading-pendekatan-pembelajaran',
      type: 'HEADING',
      level: 2,
      nodes: [{ id: 'bab3-text-heading-pendekatan-pembelajaran', type: 'TEXT', text: 'Pendekatan Pembelajaran' }]
    });

    blocks.push({
      id: 'bab3-paragraph-lo-1',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-lo-1',
        type: 'TEXT',
        text: learningOrganizationPayload.payload.educationalPhilosophy + ' ' + learningOrganizationPayload.payload.learningPrinciples
      }]
    });

    blocks.push({
      id: 'bab3-paragraph-lo-2',
      type: 'PARAGRAPH',
      nodes: [{
        id: 'bab3-text-lo-2',
        type: 'TEXT',
        text: learningOrganizationPayload.payload.implementationStrategy + ' Evaluasi ketercapaian dilakukan melalui ' + learningOrganizationPayload.payload.assessmentApproach.toLowerCase()
      }]
    });
  }
`;

  content = content.replace(
    "// Note: According to D1.0, we DO NOT implement Intracurricular, Kokurikuler, Extracurricular.",
    loBlock + "\n  // Note: According to D1.0, we DO NOT implement Intracurricular, Kokurikuler, Extracurricular."
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspBab3Structure.ts with LearningOrganizationKnowledge");
}
