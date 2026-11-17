const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/enterprise/document/ksp/KspDocumentAssembler.ts');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LearningLoadKnowledge')) {
  content = content.replace(
    "import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';",
    "import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';\nimport { LearningLoadKnowledge } from '../../knowledge/models/curriculum/LearningLoadKnowledge';"
  );
  
  const learningLoadPayload = `
  const learningLoadPayload = new LearningLoadKnowledge(
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
  );
`;

  content = content.replace(
    "const calendarInput: AcademicCalendarInput =",
    learningLoadPayload + "\n  const calendarInput: AcademicCalendarInput ="
  );

  content = content.replace(
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, calendarKnowledge.data);",
    "const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, calendarKnowledge.data);"
  );

  fs.writeFileSync(file, content);
  console.log("Updated KspDocumentAssembler.ts");
}
