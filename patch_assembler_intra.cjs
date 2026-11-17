const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/KspDocumentAssembler.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('IntracurricularKnowledge')) {
  content = content.replace(
    "import { LearningLoadAdapter, LearningOrganizationAdapter } from '../../workspace/adapters/CurriculumAdapter';",
    "import { LearningLoadAdapter, LearningOrganizationAdapter, IntracurricularAdapter } from '../../workspace/adapters/CurriculumAdapter';\nimport { IntracurricularKnowledge } from '../../knowledge/models/curriculum/IntracurricularKnowledge';"
  );

  const newPayload = `
  const normalizedIntracurricular = IntracurricularAdapter.normalize(metadata.rawIntracurricular, metadata);
  const intracurricularPayload = new IntracurricularKnowledge(
    "ic-1",
    "1.0.0",
    normalizedIntracurricular
  );
`;

  content = content.replace(
    "  const calendarInput: AcademicCalendarInput =",
    newPayload + "\n  const calendarInput: AcademicCalendarInput ="
  );

  content = content.replace(
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, learningOrganizationPayload, calendarKnowledge.data);",
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, learningOrganizationPayload, intracurricularPayload, calendarKnowledge.data);"
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspDocumentAssembler.ts with IntracurricularKnowledge");
}
