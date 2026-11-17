import { KnowledgeSource, KnowledgeCategory } from '../packs/KnowledgePackModel';
import { EvaluationContext } from '../engine/KnowledgeMatcher';

export interface SuggestionRequest {
  category: KnowledgeCategory;
  context: EvaluationContext;
  userPreferences?: Record<string, any>;
  sourceFilter?: KnowledgeSource[];
  governmentVersion?: string;
}

export interface SuggestionResult {
  id: string;
  title: string;
  summary: string;
  recommendedText: string;
  confidenceScore: number;
  source: KnowledgeSource;
  tags: string[];
  contextsMatched: string[];
  governmentReference?: string;
}
