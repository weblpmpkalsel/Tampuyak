import { ResolvedReference } from '../reference/ReferenceTypes';
import { RecommendationDecision } from '../recommendation/RecommendationTypes';

export interface GenerationRequest {
  reference: ResolvedReference;
  recommendation: RecommendationDecision | null;
  targetYear: number;
}

export interface GenerationContext {
  targetYear: number;
  existingActivities?: string[];
}

export interface GenerationIssue {
  type: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface GenerationMetadata {
  processingTimeMs: number;
  rulesEvaluated: number;
  passedValidation: boolean;
}
