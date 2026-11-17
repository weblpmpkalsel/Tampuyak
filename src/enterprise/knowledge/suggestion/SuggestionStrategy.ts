import { KnowledgeRanking } from '../engine/KnowledgeRanking';
import { SuggestionRequest, SuggestionResult } from './SuggestionModel';

export interface SuggestionStrategy {
  transform(ranking: KnowledgeRanking): SuggestionResult;
  filter(rankings: KnowledgeRanking[], request: SuggestionRequest): KnowledgeRanking[];
}

export class DefaultSuggestionStrategy implements SuggestionStrategy {
  transform(ranking: KnowledgeRanking): SuggestionResult {
    return {
      id: ranking.item.id,
      title: ranking.item.title,
      summary: ranking.item.title,
      recommendedText: ranking.item.recommendedText,
      confidenceScore: ranking.scoreDetails.score,
      source: ranking.item.source,
      tags: ranking.item.tags || [],
      contextsMatched: ranking.scoreDetails.matches,
      governmentReference: ranking.item.references?.[0]
    };
  }

  filter(rankings: KnowledgeRanking[], request: SuggestionRequest): KnowledgeRanking[] {
    let filtered = rankings;
    if (request.sourceFilter && request.sourceFilter.length > 0) {
      filtered = filtered.filter(r => request.sourceFilter!.includes(r.item.source));
    }
    return filtered;
  }
}
