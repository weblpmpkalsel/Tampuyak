import { SuggestionContract } from './SuggestionContract';
import { IntelligenceValidationResult } from '../models/ValidationResult';

export class ResponseValidator {
  /**
   * Validates every provider response (JSON structure, required fields, etc.)
   */
  public validate(contract: SuggestionContract): IntelligenceValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const businessRuleViolations: string[] = [];

    // Check base structure
    if (!contract || !contract.suggestion) {
      errors.push('Missing suggestion block in contract.');
    } else {
      const { suggestion } = contract;
      if (!suggestion.suggestionType) errors.push('Missing suggestionType.');
      if (!suggestion.reasoningSummary) errors.push('Missing reasoningSummary.');
      if (typeof suggestion.confidenceScore !== 'number') errors.push('Missing or invalid confidenceScore.');
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      status: isValid ? 'Valid' : 'Invalid',
      errors,
      warnings,
      businessRuleViolations,
      schemaVersionMatched: contract.schemaVersion === '1.0.0', // Conceptual check
      validatedAt: Date.now()
    };
  }
}
