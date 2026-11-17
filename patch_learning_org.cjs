const fs = require('fs');
let content = fs.readFileSync('src/enterprise/knowledge/services/LearningOrganizationService.ts', 'utf8');

const searchPayload = `export interface LearningOrganizationPayload {
  learningStructures: {
    curriculumTeam: string[];
  };
  learningSpaces: {
    classrooms: number;
    laboratories: string[];
    library: string;
    ict: string[];
  };
  academicTime: {
    currentYear: string;
    semester: string;
    effectiveWeeks: number;
  };
  stage: {
    schoolLevel: string;
    educationStage: string;
  };
}`;

const replacePayload = `export interface LearningOrganizationPayload {
  learningStructures: {
    curriculumTeam: string[];
  };
  learningSpaces: {
    classrooms: number;
    laboratories: string[];
    library: string;
    ict: string[];
  };
  academicTime: {
    currentYear: string;
    semester: string;
    effectiveWeeks: number;
  };
  stage: {
    schoolLevel: string;
    educationStage: string;
  };
  intracurricular?: {
    approaches: string[];
    subjects: string[];
  };
  cocurricular?: {
    projectThemes: string[];
    allocationRule: string;
  };
  extracurricular?: {
    mandatory: string[];
    optional: string[];
  };
}`;

if (content.includes(searchPayload)) {
  content = content.replace(searchPayload, replacePayload);
}

fs.writeFileSync('src/enterprise/knowledge/services/LearningOrganizationService.ts', content);
console.log('patched payload');
