import { RecommendationDecision, RecommendationMetadata } from './RecommendationTypes';

export interface RecommendationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  recommendations: RecommendationDecision[];
  selectedRecommendation: RecommendationDecision | null;
  metadata?: RecommendationMetadata;
}
