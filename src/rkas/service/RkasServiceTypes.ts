import { RecommendationCandidate } from '../../recommendation/RecommendationTypes';
import { RkasServiceResult } from './RkasServiceResult';

export interface RkasWorkspaceContext {
  workspaceId: string;
  userId: string;
  role: string;
  timestamp: number;
}

export interface GenerationOptions {
  strictValidation?: boolean;
  allowPartialGeneration?: boolean;
  dryRun?: boolean;
}

export interface GenerateRkasRequest {
  planningActivities: any[];
  year: number;
  recommendationCandidates: RecommendationCandidate[];
  existingActivities?: string[];
  context: RkasWorkspaceContext;
  options?: GenerationOptions;
}

export type GenerateRkasResponse = RkasServiceResult;
