import { BudgetRequest } from './BudgetTypes';

export class BudgetValidator {
  public static validate(request: BudgetRequest): string[] {
    const errors: string[] = [];
    
    if (!request.year) {
      errors.push('Missing Year');
    }
    
    const pa = request.planningActivity;
    
    if (!pa && !request.resolvedReference) {
       errors.push('Missing both Planning Activity and Resolved Reference');
       return errors;
    }
    
    // If we have resolvedReference but no planning activity, we use legacy validation
    if (!pa && request.resolvedReference) {
      if (!request.generationResult || !request.generationResult.validationPassed) {
        errors.push('Generation validation did not pass');
      }
      
      if (!request.resolvedReference.activity) {
        errors.push('Missing Activity');
      }
    }
    
    return errors;
  }
}
