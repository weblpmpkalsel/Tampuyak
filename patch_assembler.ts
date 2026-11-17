import * as fs from 'fs';

const filePath = 'src/enterprise/document/ksp/KspDocumentAssembler.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Replace imports
code = code.replace(
  "import { LearningOrganizationKnowledge, buildLearningOrganization } from '../../knowledge/builders/LearningOrganizationBuilder';",
  "import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';"
);
code = code.replace(
  "import { processLearningOrganization, LearningOrganizationInput } from '../../knowledge/services/LearningOrganizationService';\n",
  ""
);

// Replace Bab 3 build logic
const oldBab3Block = `  const learningOrgInput: LearningOrganizationInput = {
    profile: {
      metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'Draft', domain: 'SchoolProfile' },
      properties: { schoolLevel: metadata.schoolLevel, educationStage: metadata.phase }
    } as any,
    academicYear: {
      metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'Draft', domain: 'AcademicYear' },
      properties: { currentYear: metadata.academicYear }
    } as any,
    organization: {
      metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'Draft', domain: 'SchoolOrganization' },
      properties: { curriculumTeam: [metadata.principalName, metadata.supervisorName].filter(Boolean) }
    } as any
  };

  const loServiceResult = processLearningOrganization(learningOrgInput);
  const loKnowledge = buildLearningOrganization({ serviceResult: loServiceResult });
  const learningOrgPayload = loKnowledge.data;`;

const newBab3Block = `  const curriculumStructurePayload = new CurriculumStructureKnowledge(
    'struct-1',
    '1.0.0',
    {
      educationLevel: metadata.schoolLevel || 'Sekolah Dasar',
      phase: metadata.phase || 'A, B, dan C',
      curriculumType: 'Kurikulum Merdeka'
    }
  );`;

code = code.replace(oldBab3Block, newBab3Block);
code = code.replace(
  "const bab3Section = buildKspBab3Section(learningOrgPayload, calendarKnowledge.data);",
  "const bab3Section = buildKspBab3Section(curriculumStructurePayload, calendarKnowledge.data);"
);

fs.writeFileSync(filePath, code);
