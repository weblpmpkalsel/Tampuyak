const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/KspDocumentAssembler.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('CocurricularKnowledge')) {
  content = content.replace(
    "import { LearningLoadAdapter, LearningOrganizationAdapter, IntracurricularAdapter } from '../../workspace/adapters/CurriculumAdapter';",
    "import { LearningLoadAdapter, LearningOrganizationAdapter, IntracurricularAdapter, CocurricularAdapter } from '../../workspace/adapters/CurriculumAdapter';\nimport { CocurricularKnowledge } from '../../knowledge/models/curriculum/CocurricularKnowledge';"
  );

  const newPayload = `
  const normalizedCocurricular = CocurricularAdapter.normalize(metadata.rawCocurricular, metadata);
  const cocurricularPayload = new CocurricularKnowledge(
    "cc-1",
    "1.0.0",
    normalizedCocurricular
  );
`;

  content = content.replace(
    "  const calendarInput: AcademicCalendarInput =",
    newPayload + "\n  const calendarInput: AcademicCalendarInput ="
  );

  content = content.replace(
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, learningOrganizationPayload, intracurricularPayload, calendarKnowledge.data);",
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, learningOrganizationPayload, intracurricularPayload, cocurricularPayload, calendarKnowledge.data);"
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspDocumentAssembler.ts with CocurricularKnowledge");
}
