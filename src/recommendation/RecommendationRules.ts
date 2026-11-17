import { RecommendationCandidate } from './RecommendationTypes';
import { ResolvedReference } from '../reference/ReferenceTypes';

export class RecommendationRules {
  public static isExactNameMatch(reference: ResolvedReference, candidate: RecommendationCandidate): boolean {
    const refName = reference.originalRequest.activityName.toLowerCase();
    const candName = candidate.name.toLowerCase();
    return refName === candName;
  }

  public static isExactCodeMatch(reference: ResolvedReference, candidate: RecommendationCandidate): boolean {
    if (!reference.originalRequest.activityCode) return false;
    return reference.originalRequest.activityCode === candidate.code;
  }

  public static isPartialNameMatch(reference: ResolvedReference, candidate: RecommendationCandidate): boolean {
    const refName = reference.originalRequest.activityName.toLowerCase();
    const candName = candidate.name.toLowerCase();
    return candName.includes(refName) || refName.includes(candName);
  }

  public static isCategoryMatch(reference: ResolvedReference, candidate: RecommendationCandidate): boolean {
    if (!reference.component || !candidate.category) return false;
    return reference.component.category === candidate.category;
  }
  
  public static isFundingCompatible(reference: ResolvedReference, candidate: RecommendationCandidate): boolean {
    return true; 
  }
}
