import { RecommendationRequest, RecommendationCandidate, RecommendationDecision } from './RecommendationTypes';
import { RecommendationResult } from './RecommendationResult';
import { RecommendationScoring } from './RecommendationScoring';

export class RecommendationEngine {
  public static evaluate(request: RecommendationRequest, candidates: RecommendationCandidate[]): RecommendationResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const decisions: RecommendationDecision[] = [];

    if (!request.reference) {
      errors.push("Missing resolved reference in request.");
      return {
        success: false,
        errors,
        warnings,
        recommendations: [],
        selectedRecommendation: null
      };
    }

    for (const candidate of candidates) {
      const score = RecommendationScoring.calculateScore(request.reference, candidate);
      
      // Only keep candidates with a positive score
      if (score.score > 0) {
        decisions.push({
          candidate,
          score,
          rank: 0 // Will be set during sorting
        });
      }
    }

    // Sort descending by score
    decisions.sort((a, b) => b.score.score - a.score.score);

    // Assign ranks
    decisions.forEach((decision, index) => {
      decision.rank = index + 1;
    });

    const selectedRecommendation = decisions.length > 0 ? decisions[0] : null;

    if (decisions.length === 0) {
        warnings.push("No suitable recommendations found for the provided reference.");
    }

    return {
      success: errors.length === 0,
      errors,
      warnings,
      recommendations: decisions,
      selectedRecommendation,
      metadata: {
        processingTimeMs: Date.now() - startTime,
        totalCandidatesEvaluated: candidates.length,
        rulesApplied: ['ExactCodeMatch', 'ExactNameMatch', 'PartialNameMatch', 'CategoryMatch', 'FundingCompatible']
      }
    };
  }
}
