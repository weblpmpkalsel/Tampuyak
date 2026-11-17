import { GenerationRequest, GenerationContext, GenerationIssue } from './GenerationTypes';

export class GenerationRules {
  public static checkReferenceExists(request: GenerationRequest, issues: GenerationIssue[]): boolean {
    if (!request.reference || !request.reference.originalRequest) {
      issues.push({ type: 'MissingReference', message: 'Resolved Reference is missing.', severity: 'error' });
      return false;
    }
    return true;
  }

  public static checkRecommendationExists(request: GenerationRequest, issues: GenerationIssue[]): boolean {
    if (!request.recommendation) {
      issues.push({ type: 'MissingRecommendation', message: 'No valid recommendation was provided for generation.', severity: 'warning' });
      return true;
    }
    return true;
  }

  public static checkActivityAndProgram(request: GenerationRequest, issues: GenerationIssue[]): boolean {
    let isValid = true;
    if (!request.reference.activity) {
      if (request.reference.originalRequest) {
        request.reference.activity = {
           id: request.reference.originalRequest.activityId || 'ACT-UNKNOWN',
           code: request.reference.originalRequest.activityCode || '-',
           name: request.reference.originalRequest.activityName || 'Unknown Activity'
        };
      } else {
        issues.push({ type: 'MissingActivity', message: 'Reference Activity is missing.', severity: 'error' });
        isValid = false;
      }
    }
    if (!request.reference.program) {
      if (request.reference.originalRequest) {
        request.reference.program = {
           id: 'PROG-UNKNOWN',
           code: '-',
           name: '-'
        };
      } else {
        issues.push({ type: 'MissingProgram', message: 'Reference Program is missing.', severity: 'error' });
        isValid = false;
      }
    }
    return isValid;
  }

  public static checkFinancialMetadata(request: GenerationRequest, issues: GenerationIssue[]): boolean {
    let isValid = true;
    if (!request.reference.account) {
      issues.push({ type: 'MissingAccount', message: 'Account reference is missing.', severity: 'warning' });
    }
    if (!request.reference.funding) {
      issues.push({ type: 'MissingFunding', message: 'Funding reference is missing.', severity: 'warning' });
    }
    if (!request.reference.component) {
      issues.push({ type: 'MissingComponent', message: 'Component reference is missing.', severity: 'warning' });
    }
    return isValid;
  }

  public static checkYearMatches(request: GenerationRequest, context: GenerationContext, issues: GenerationIssue[]): boolean {
    if (!request.reference.originalRequest.year) {
      issues.push({ type: 'InvalidYear', message: 'Planning year is missing in the request.', severity: 'error' });
      return false;
    }
    if (request.reference.originalRequest.year !== context.targetYear) {
      issues.push({ 
        type: 'YearMismatch', 
        message: `Activity year (${request.reference.originalRequest.year}) does not match target RKAS year (${context.targetYear}).`, 
        severity: 'error' 
      });
      return false;
    }
    return true;
  }

  public static checkDuplicateActivity(request: GenerationRequest, context: GenerationContext, issues: GenerationIssue[]): boolean {
    if (context.existingActivities && request.recommendation) {
      if (context.existingActivities.includes(request.recommendation.candidate.id)) {
        issues.push({ type: 'DuplicateActivity', message: 'Activity already exists in target RKAS.', severity: 'error' });
        return false;
      }
    }
    return true;
  }
}
