import { RecommendationCandidate, RecommendationScore } from './RecommendationTypes';
import { ResolvedReference } from '../reference/ReferenceTypes';
import { RecommendationRules } from './RecommendationRules';

export class RecommendationScoring {
  public static calculateScore(reference: ResolvedReference, candidate: RecommendationCandidate): RecommendationScore {
    let totalScore = 0;
    const factors: Record<string, number> = {};

    if (RecommendationRules.isExactCodeMatch(reference, candidate)) {
      totalScore += 95;
      factors['ExactCodeMatch'] = 95;
    } else if (RecommendationRules.isExactNameMatch(reference, candidate)) {
      totalScore += 100;
      factors['ExactNameMatch'] = 100;
    } else if (RecommendationRules.isPartialNameMatch(reference, candidate)) {
      totalScore += 70;
      factors['PartialNameMatch'] = 70;
    }

    if (RecommendationRules.isCategoryMatch(reference, candidate)) {
      totalScore += 10; // Bonus
      factors['CategoryMatch'] = 10;
    }

    // Normalize to 100 for simplicity if it exceeds
    totalScore = Math.min(totalScore, 100);

    if (!RecommendationRules.isFundingCompatible(reference, candidate)) {
        totalScore = 0;
        factors['FundingIncompatible'] = -100;
    }

    return {
      score: totalScore,
      factors
    };
  }
}
