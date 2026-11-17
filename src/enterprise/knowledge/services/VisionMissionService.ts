import { SchoolProfile } from '../../master-data/SchoolProfile.model';
import { SchoolGovernance } from '../../master-data/SchoolGovernance.model';
import { AcademicYear } from '../../master-data/AcademicYear.model';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';
import { ValidationResult, ValidationIssue, ValidationStatus, ProcessingMetadata } from '../validation/ValidationTypes';

/**
 * Structured payload for Strategic Direction (Vision, Mission, and Goals).
 */
export interface VisionMissionPayload {
  vision: string;
  mission: string[];
  goals: string[];
}

/**
 * Represents the source input for strategic policy, which can come from
 * various systems or manual input.
 */
export interface StrategicPolicyInput {
  vision?: string;
  mission?: string[];
  goals?: string[];
  sourceVersion?: string;
  origin?: 'MASTER_DATA' | 'POLICY_CENTER' | 'MANUAL_ENTRY';
}

/**
 * Input arguments for processing Vision and Mission context.
 */
export interface VisionMissionInput {
  profile: SchoolProfile;
  governance: SchoolGovernance;
  academicYear: AcademicYear;
  strategicPolicy?: StrategicPolicyInput;
}

/**
 * Output of the VisionMissionService containing the knowledge object, validation, and metadata.
 */
export interface VisionMissionServiceResult {
  knowledge: CanonicalKnowledgeObject<VisionMissionPayload>;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
  sourceVersions: Record<string, string>;
}

const SERVICE_VERSION = '1.0.0';

/**
 * Validates the completeness of the strategic payload (Vision, Mission, Goals).
 */
function validateStrategicPayload(payload: VisionMissionPayload): ValidationResult {
  const issues: ValidationIssue[] = [];
  let status: ValidationStatus = 'PASS';

  if (!payload.vision || payload.vision.trim() === '') {
    issues.push({
      field: 'vision',
      message: 'Missing Vision',
      severity: 'WARNING'
    });
    status = 'WARNING';
  }

  if (!payload.mission || payload.mission.length === 0) {
    issues.push({
      field: 'mission',
      message: 'Missing Mission',
      severity: 'WARNING'
    });
    status = 'WARNING';
  }

  if (!payload.goals || payload.goals.length === 0) {
    issues.push({
      field: 'goals',
      message: 'Missing Goals',
      severity: 'WARNING'
    });
    status = 'WARNING';
  }

  return { status, issues };
}

/**
 * Normalizes strategic values by performing technical cleanup (whitespace trimming).
 * Does not mutate the original input or perform semantic modifications.
 */
function normalizePayload(policy?: StrategicPolicyInput): VisionMissionPayload {
  return {
    vision: policy?.vision?.trim() ?? '',
    mission: (policy?.mission ?? []).map(m => m.trim()).filter(m => m.length > 0),
    goals: (policy?.goals ?? []).map(g => g.trim()).filter(g => g.length > 0)
  };
}

/**
 * Processes and canonicalizes the strategic direction of the school.
 * Returns immutable strategic context, validation, and processing metadata.
 * 
 * @param input Aggregated raw Master Data entities and Strategic Policy.
 * @returns Canonical knowledge object with validation and traceability metadata.
 */
export function processVisionMission(input: VisionMissionInput): VisionMissionServiceResult {
  // Normalize policy input without mutation
  const payload = normalizePayload(input.strategicPolicy);
  
  // Validate structural integrity
  const validation = validateStrategicPayload(payload);

  const policyOrigin = input.strategicPolicy?.origin ?? 'MASTER_DATA';
  const policyVersion = input.strategicPolicy?.sourceVersion ?? 'unknown';

  const knowledgeSource: KnowledgeSource = {
    origin: policyOrigin,
    serviceVersion: SERVICE_VERSION
  };

  const knowledge: CanonicalKnowledgeObject<VisionMissionPayload> = {
    metadata: {
      id: `VM-${Date.now()}`,
      domain: 'VisionMission',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lifecycle: 'GENERATED',
      source: knowledgeSource
    },
    data: payload
  };

  const sourceVersions: Record<string, string> = {
    profile: input.profile.metadata.version,
    governance: input.governance.metadata.version,
    academicYear: input.academicYear.metadata.version,
    strategicPolicy: policyVersion
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
    sourceVersions
  };
}
