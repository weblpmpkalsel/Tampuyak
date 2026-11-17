import { ExecutionRecord } from '../models/ExecutionRecord';

export interface ExecutionValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ExecutionValidator {
  public static validate(record: ExecutionRecord): ExecutionValidationResult {
    const errors: string[] = [];
    
    if (!record.executionId) errors.push('Missing executionId');
    if (!record.sourceActivityId) errors.push('Missing sourceActivityId');
    if (record.progressPercentage < 0 || record.progressPercentage > 100) {
      errors.push('Progress percentage must be between 0 and 100');
    }
    
    // Add business rules validation logic here in the future
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
