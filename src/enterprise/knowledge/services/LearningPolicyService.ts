import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';
import { ValidationResult, ValidationIssue, ValidationStatus, ProcessingMetadata } from '../validation/ValidationTypes';

export interface LearningPolicyPayload {
  principles: string[];
  approach: string;
  planningPolicy: string;
  assessmentPolicy: string[];
  inclusiveEducation: string;
  differentiationPolicy: string;
  digitalLearning: string;
  partnershipPolicy: string;
  characterEducation: string;
}

export interface LearningPolicyInput {
  principles?: string[];
  approach?: string;
  planningPolicy?: string;
  assessmentPolicy?: string[];
  inclusiveEducation?: string;
  differentiationPolicy?: string;
  digitalLearning?: string;
  partnershipPolicy?: string;
  characterEducation?: string;
  sourceVersion?: string;
  origin?: 'POLICY_CENTER' | 'MANUAL_ENTRY';
}

export interface LearningPolicyServiceResult {
  knowledge: CanonicalKnowledgeObject<LearningPolicyPayload>;
  validation: ValidationResult;
  processingMetadata: ProcessingMetadata;
  sourceVersions: Record<string, string>;
  completenessScore: number;
}
