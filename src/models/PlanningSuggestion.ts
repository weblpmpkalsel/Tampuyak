export type SuggestionStatus = 'Generated' | 'Validated' | 'Pending Review' | 'Approved' | 'Rejected' | 'Archived';

export interface PlanningSuggestion {
  suggestionId: string;
  suggestionType: string;
  
  prioritySuggestion?: string;
  timelineSuggestion?: {
    optimalStartDate?: string;
    dependencies?: string[];
  };
  responsiblePersonSuggestion?: string;
  budgetReferenceSuggestion?: {
    estimatedBudget?: number;
    fundingSource?: string;
  };
  
  reasoningSummary: string;
  confidenceScore: number; // 0 to 1
  warnings: string[];
}
