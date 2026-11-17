import { PlanningSuggestion } from '../models/PlanningSuggestion';

/**
 * SuggestionContract defines the standard response expected from every provider.
 */
export interface SuggestionContract {
  contractId: string;
  providerName: string;
  schemaVersion: string;
  
  suggestion: PlanningSuggestion;
  
  metadata: {
    generatedAt: number;
    promptVersion: string;
    businessRuleVersion: string;
    processingTimeMs?: number;
  };
}
