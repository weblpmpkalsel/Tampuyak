export type IntelligenceValidationStatus = 'Valid' | 'Invalid' | 'NeedsHumanReview';

export interface IntelligenceValidationResult {
  isValid: boolean;
  status: IntelligenceValidationStatus;
  errors: string[];
  warnings: string[];
  businessRuleViolations: string[];
  schemaVersionMatched: boolean;
  validatedAt: number;
}
