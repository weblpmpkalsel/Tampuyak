import { ReferenceRequest } from './ReferenceTypes';

export class ReferenceValidator {
  public static validate(request: ReferenceRequest): string[] {
    const errors: string[] = [];
    
    if (!request.activityId) {
      errors.push('Missing activity id');
    }
    
    if (!request.activityName) {
      errors.push('Missing activity name');
    }
    
    if (!request.year) {
      errors.push('Missing year');
    }
    
    return errors;
  }
}
