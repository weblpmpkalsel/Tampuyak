import { SchoolOrganization } from '../../master-data/SchoolOrganization.model';
import { AcademicYear } from '../../master-data/AcademicYear.model';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';
import { ValidationResult, ValidationIssue, ValidationStatus, ProcessingMetadata } from '../validation/ValidationTypes';

/**
 * Structured payload for Evaluation knowledge.
 * Note: Upgraded in Phase 9 to include Professional Development and Monitoring.
 */
export interface EvaluationPayload {
  evaluationMechanisms: string[];
  schedule: string;
  responsibleParties: string[];
  professionalDevelopment?: string[];
  monitoringPolicy?: string;
  academicSupervision?: string;
  continuousImprovement?: string;
  qualityAssurance?: string;
  followUpPlanning?: string;
  schoolLevelMentoring?: string;
}

/**
 * Represents the source input for evaluation policy.
 * Note: This is a temporary upstream contract. In the future, this will be
 * provided by a canonical PolicyService.
 */
export interface EvaluationPolicyInput {
  evaluationMechanisms?: string[];
  schedule?: string;
  responsibleParties?: string[];
  professionalDevelopment?: string[];
  monitoringPolicy?: string;
  academicSupervision?: string;
  continuousImprovement?: string;
  qualityAssurance?: string;
  followUpPlanning?: string;
  schoolLevelMentoring?: string;
  sourceVersion?: string;
  origin?: 'POLICY_CENTER' | 'MANUAL_ENTRY';
}

/**
 * Input arguments for processing Evaluation context.
 */
export interface EvaluationInput {
  organization?: SchoolOrganization;
  academicYear?: AcademicYear;
  evaluationPolicy?: EvaluationPolicyInput;
}

/**
 * Output of the EvaluationService containing the knowledge object, validation, and metadata.
 */
export interface EvaluationServiceResult {
  knowledge: CanonicalKnowledgeObject<EvaluationPayload>;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
  sourceVersions: Record<string, string>;
  completenessScore: number;
}

const SERVICE_VERSION = '1.0.0';

/**
 * Normalizes evaluation values by performing technical cleanup (whitespace trimming).
 * Enterprise Rule 036: Technical normalization only. Semantic enrichment is forbidden.
 */
function normalizeEvaluation(input: EvaluationInput): EvaluationPayload {
  const policy = input.evaluationPolicy;
  return {
    evaluationMechanisms: (policy?.evaluationMechanisms ?? []).map(m => m.trim()).filter(m => m.length > 0),
    schedule: policy?.schedule?.trim() ?? '',
    responsibleParties: (policy?.responsibleParties ?? []).map(p => p.trim()).filter(p => p.length > 0),
    professionalDevelopment: (policy?.professionalDevelopment ?? []).map(p => p.trim()).filter(p => p.length > 0),
    monitoringPolicy: policy?.monitoringPolicy?.trim(),
    academicSupervision: policy?.academicSupervision?.trim(),
    continuousImprovement: policy?.continuousImprovement?.trim(),
    qualityAssurance: policy?.qualityAssurance?.trim(),
    followUpPlanning: policy?.followUpPlanning?.trim(),
    schoolLevelMentoring: policy?.schoolLevelMentoring?.trim()
  };
}

/**
 * Validates the completeness of the evaluation structure.
 * Calculates a completeness score (0-100) based on structural completeness,
 * representing structural presence only, without qualitative assessment.
 */
function validateEvaluation(payload: EvaluationPayload): { validation: ValidationResult, completenessScore: number } {
  const issues: ValidationIssue[] = [];
  let status: ValidationStatus = 'PASS';
  let passedChecks = 0;
  const totalChecks = 3;

  if (payload.evaluationMechanisms.length === 0) {
    issues.push({
      field: 'evaluationMechanisms',
      message: 'Missing evaluation mechanisms',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else {
    passedChecks++;
  }

  if (!payload.schedule) {
    issues.push({
      field: 'schedule',
      message: 'Missing evaluation schedule',
      severity: 'WARNING'
    });
    status = 'WARNING';
  } else {
    passedChecks++;
  }

  if (payload.responsibleParties.length === 0) {
    issues.push({
      field: 'responsibleParties',
      message: 'Missing responsible parties',
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
 * Processes and canonicalizes the evaluation domain.
 * Returns immutable knowledge, validation, completeness score, and metadata.
 * 
 * @param input Aggregated raw Master Data entities and Evaluation Policy.
 * @returns Canonical knowledge object with validation and traceability metadata.
 */
export function processEvaluation(input: EvaluationInput): EvaluationServiceResult {
  const payload = normalizeEvaluation(input);
  const { validation, completenessScore } = validateEvaluation(payload);

  const policyOrigin = input.evaluationPolicy?.origin ?? 'MANUAL_ENTRY';
  const policyVersion = input.evaluationPolicy?.sourceVersion ?? 'unknown';

  const knowledgeSource: KnowledgeSource = {
    origin: policyOrigin,
    serviceVersion: SERVICE_VERSION
  };

  const knowledge: CanonicalKnowledgeObject<EvaluationPayload> = {
    metadata: {
      id: `EVAL-${Date.now()}`,
      domain: 'Evaluation',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lifecycle: 'GENERATED',
      source: knowledgeSource
    },
    data: payload
  };

  const sourceVersions: Record<string, string> = {
    organization: input.organization?.metadata.version ?? 'unknown',
    academicYear: input.academicYear?.metadata.version ?? 'unknown',
    evaluationPolicy: policyVersion
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
