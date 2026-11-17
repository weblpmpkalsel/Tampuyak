import { RecommendationCandidate } from '../../recommendation/RecommendationTypes';
import { RkasWorkspaceContext, GenerationOptions } from '../service/RkasServiceTypes';
import { RkasModel, RkasGenerationMetadata } from '../generator/RkasGeneratorTypes';

export interface WorkspaceState {
  activities: any[];
  targetYear: number;
  recommendations: RecommendationCandidate[];
  existingIds?: string[];
  context: RkasWorkspaceContext;
  options?: GenerationOptions;
}

export interface WorkspaceRkasModel {
  id: string;
  year: number;
  items: any[];
  rawModel: RkasModel;
  metadata?: RkasGenerationMetadata;
}
