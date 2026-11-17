import { ResolvedReference } from '../reference/ReferenceTypes';

export interface RecommendationRequest {
  reference: ResolvedReference;
  context?: Record<string, any>;
}

export interface RecommendationCandidate {
  id: string;
  code: string;
  name: string;
  category?: string;
}

export interface RecommendationScore {
  score: number;
  factors: Record<string, number>;
}

export interface RecommendationDecision {
  candidate: RecommendationCandidate;
  score: RecommendationScore;
  rank: number;
}

export interface RecommendationMetadata {
  processingTimeMs: number;
  totalCandidatesEvaluated: number;
  rulesApplied: string[];
}
