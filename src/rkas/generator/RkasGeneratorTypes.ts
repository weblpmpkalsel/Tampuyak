import { BudgetStructure } from '../../budget/BudgetTypes';
import { RecommendationCandidate } from '../../recommendation/RecommendationTypes';

export interface RkasGenerationRequest {
  planningActivities: any[];
  year: number;
  recommendationCandidates: RecommendationCandidate[];
  existingActivities?: string[];
}

export interface RkasModel {
  id: string;
  year: number;
  budgetStructures: BudgetStructure[];
  createdAt: number;
}

export interface RkasGenerationMetadata {
  processingTimeMs: number;
  totalActivitiesProcessed: number;
  successfulGenerations: number;
  failedGenerations: number;
}
