import { GenerationRequest, GenerationContext, GenerationIssue } from './GenerationTypes';
import { GenerationResult } from './GenerationResult';
import { GenerationRules } from './GenerationRules';

export class GenerationValidator {
  public static validate(request: GenerationRequest, context: GenerationContext): GenerationResult {
    const startTime = Date.now();
    const issues: GenerationIssue[] = [];
    let rulesEvaluated = 0;

    const hasRef = GenerationRules.checkReferenceExists(request, issues);
    rulesEvaluated++;

    if (hasRef) {
      GenerationRules.checkRecommendationExists(request, issues);
      rulesEvaluated++;

      GenerationRules.checkActivityAndProgram(request, issues);
      rulesEvaluated++;

      GenerationRules.checkFinancialMetadata(request, issues);
      rulesEvaluated++;

      GenerationRules.checkYearMatches(request, context, issues);
      rulesEvaluated++;

      GenerationRules.checkDuplicateActivity(request, context, issues);
      rulesEvaluated++;
    }

    const errors = issues.filter(i => i.severity === 'error').map(i => i.message);
    const warnings = issues.filter(i => i.severity === 'warning').map(i => i.message);
    const validationPassed = errors.length === 0;

    return {
      success: true,
      errors,
      warnings,
      validationPassed,
      issues,
      metadata: {
        processingTimeMs: Date.now() - startTime,
        rulesEvaluated,
        passedValidation: validationPassed
      }
    };
  }
}
