const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/KspDocumentAssembler.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningOrganizationAdapter')) {
  content = content.replace(
    "import { LearningLoadAdapter } from '../../workspace/adapters/CurriculumAdapter';",
    "import { LearningLoadAdapter, LearningOrganizationAdapter } from '../../workspace/adapters/CurriculumAdapter';\nimport { LearningOrganizationKnowledge } from '../../knowledge/models/curriculum/LearningOrganizationKnowledge';"
  );

  const newPayload = `
  const normalizedLearningOrg = LearningOrganizationAdapter.normalize(metadata.rawLearningOrganization, metadata);
  const learningOrganizationPayload = new LearningOrganizationKnowledge(
    "lo-1",
    "1.0.0",
    normalizedLearningOrg
  );
`;

  content = content.replace(
    "  const calendarInput: AcademicCalendarInput =",
    newPayload + "\n  const calendarInput: AcademicCalendarInput ="
  );

  content = content.replace(
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, calendarKnowledge.data);",
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, learningOrganizationPayload, calendarKnowledge.data);"
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspDocumentAssembler.ts with LearningOrganizationKnowledge");
}
