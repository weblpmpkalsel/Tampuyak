const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/KspDocumentAssembler.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningLoadAdapter')) {
  content = content.replace(
    "import { KspMetadata } from '../../../ksp/KspMetadataAdapter';",
    "import { KspMetadata } from '../../../ksp/KspMetadataAdapter';\nimport { LearningLoadAdapter } from '../../workspace/adapters/CurriculumAdapter';"
  );

  const oldPayload = `  const learningLoadPayload = new LearningLoadKnowledge(
    "ll-1",
    "1.0.0",
    {
      educationLevel: metadata.schoolLevel || "Sekolah Dasar (SD)",
      phase: metadata.phase || "Fase A",
      academicYear: metadata.academicYear || "2026/2027",
      weeklyLearningLoad: 32,
      annualLearningLoad: 1152,
      effectiveWeeks: 36,
      totalLearningHours: 1152
    }
  );`;

  const newPayload = `  const normalizedLearningLoad = LearningLoadAdapter.normalize(metadata.rawLearningLoad, metadata);
  const learningLoadPayload = new LearningLoadKnowledge(
    "ll-1",
    "1.0.0",
    normalizedLearningLoad
  );`;

  content = content.replace(oldPayload, newPayload);
  fs.writeFileSync(file, content);
  console.log("Updated KspDocumentAssembler.ts with LearningLoadAdapter");
}
