import { SchoolProfile } from '../../master-data/SchoolProfile.model';
import { SchoolOrganization } from '../../master-data/SchoolOrganization.model';
import { AcademicYear } from '../../master-data/AcademicYear.model';
import { Facilities } from '../../master-data/Facilities.model';
import { SchoolGovernance } from '../../master-data/SchoolGovernance.model';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';
import { ValidationResult, ValidationIssue, ValidationStatus, ProcessingMetadata } from '../validation/ValidationTypes';

/**
 * Payload representing the organization of learning.
 * Excludes HR and administrative structures.
 */
export interface LearningOrganizationPayload {
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
}

/**
 * Input arguments for processing Learning Organization context.
 */
export interface LearningOrganizationInput {
  profile?: SchoolProfile;
  organization?: SchoolOrganization;
  academicYear?: AcademicYear;
  facilities?: Facilities;
  governance?: SchoolGovernance;
}

/**
 * Output of the LearningOrganizationService containing the knowledge object, validation, and metadata.
 */
export interface LearningOrganizationServiceResult {
  knowledge: CanonicalKnowledgeObject<LearningOrganizationPayload>;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
  sourceVersions: Record<string, string>;
  completenessScore: number;
}

const SERVICE_VERSION = '1.0.0';

/**
 * Normalizes organizational structures relevant to learning.
 * Trims whitespace and prevents mutation of the input.
 */
function normalizeLearningOrganization(input: LearningOrganizationInput): LearningOrganizationPayload {
  return {
    learningStructures: {
      curriculumTeam: [...(input.organization?.properties.curriculumTeam || [])].map(t => t.trim()).filter(Boolean),
    },
    learningSpaces: {
      classrooms: input.facilities?.properties.classrooms ?? 0,
      laboratories: [...(input.facilities?.properties.laboratories || [])].map(l => l.trim()).filter(Boolean),
      library: input.facilities?.properties.library?.trim() ?? '',
      ict: [...(input.facilities?.properties.ict || [])].map(i => i.trim()).filter(Boolean),
    },
    academicTime: {
      currentYear: input.academicYear?.properties.currentYear?.trim() ?? '',
      semester: input.academicYear?.properties.semester?.trim() ?? '',
      effectiveWeeks: input.academicYear?.properties.effectiveWeeks ?? 0,
    },
    stage: {
      schoolLevel: input.profile?.properties.schoolLevel?.trim() ?? '',
      educationStage: input.profile?.properties.educationStage?.trim() ?? '',
    }
  };
}

/**
 * Validates the completeness of the Learning Organization structure.
 * Calculates a completeness score (0-100) based on structural completeness.
 */
function validateLearningOrganization(payload: LearningOrganizationPayload, input: LearningOrganizationInput): { validation: ValidationResult, completenessScore: number } {
  const issues: ValidationIssue[] = [];
  let status: ValidationStatus = 'PASS';
  let passedChecks = 0;
  const totalChecks = 4;

  // Check 1: Organizational Structure (Curriculum Team)
  if (!input.organization || payload.learningStructures.curriculumTeam.length === 0) {
    issues.push({
      field: 'organization',
      message: 'Missing organizational structure',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else {
    passedChecks++;
  }

  // Check 2: Facilities / Learning Spaces
  if (!input.facilities || (payload.learningSpaces.classrooms === 0 && payload.learningSpaces.laboratories.length === 0 && !payload.learningSpaces.library)) {
    issues.push({
      field: 'facilities',
      message: 'Missing facilities',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else {
    passedChecks++;
  }

  // Check 3: Academic Year
  if (!input.academicYear || (!payload.academicTime.currentYear && payload.academicTime.effectiveWeeks === 0)) {
    issues.push({
      field: 'academicYear',
      message: 'Missing academic year',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else {
    passedChecks++;
  }

  // Check 4: Profile / Stage
  if (!input.profile || (!payload.stage.schoolLevel && !payload.stage.educationStage)) {
    issues.push({
      field: 'profile',
      message: 'Missing school profile stage information',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else {
    passedChecks++;
  }

  const completenessScore = Math.round((passedChecks / totalChecks) * 100);

  return { validation: { status, issues }, completenessScore };
}

/**
 * Processes and canonicalizes the organization of learning.
 * Returns immutable structural knowledge, validation, completeness score, and metadata.
 * 
 * @param input Aggregated raw Master Data entities.
 * @returns Canonical knowledge object with validation and traceability metadata.
 */
export function processLearningOrganization(input: LearningOrganizationInput): LearningOrganizationServiceResult {
  const payload = normalizeLearningOrganization(input);
  const { validation, completenessScore } = validateLearningOrganization(payload, input);

  const knowledgeSource: KnowledgeSource = {
    origin: 'MASTER_DATA',
    serviceVersion: SERVICE_VERSION
  };

  const knowledge: CanonicalKnowledgeObject<LearningOrganizationPayload> = {
    metadata: {
      id: `LO-${Date.now()}`,
      domain: 'LearningOrganization',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lifecycle: 'GENERATED',
      source: knowledgeSource
    },
    data: payload
  };

  const sourceVersions: Record<string, string> = {
    profile: input.profile?.metadata.version ?? 'unknown',
    organization: input.organization?.metadata.version ?? 'unknown',
    academicYear: input.academicYear?.metadata.version ?? 'unknown',
    facilities: input.facilities?.metadata.version ?? 'unknown',
    governance: input.governance?.metadata.version ?? 'unknown'
  };

  const processingMetadata: ProcessingMetadata = {
    processedAt: new Date().toISOString(),
    serviceVersion: SERVICE_VERSION,
    sourceVersion: 'aggregated'
  };

  return {
    knowledge,
    validation,
    processingMetadata,
    sourceVersions,
    completenessScore
  };
}
