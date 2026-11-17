import { KnowledgeItem } from '../packs/KnowledgePackModel';
import { KnowledgeMatcher, EvaluationContext } from './KnowledgeMatcher';
import { KnowledgeRanking } from './KnowledgeRanking';

export class KnowledgeContextEngine {
  
  match(items: KnowledgeItem[], context: EvaluationContext): KnowledgeRanking[] {
    return items.map(item => {
      const scoreDetails = KnowledgeMatcher.evaluate(item, context);
      return {
        item,
        scoreDetails
      };
    });
  }

  rank(rankings: KnowledgeRanking[]): KnowledgeRanking[] {
    return rankings
      .filter(r => !r.scoreDetails.hardConstraintFailed)
      .sort((a, b) => {
        if (b.scoreDetails.score !== a.scoreDetails.score) {
          return b.scoreDetails.score - a.scoreDetails.score;
        }
        return (b.item.priority || 0) - (a.item.priority || 0);
      });
  }

  topSuggestions(items: KnowledgeItem[], context: EvaluationContext, limit: number = 5): KnowledgeItem[] {
    const matched = this.match(items, context);
    const ranked = this.rank(matched);
    return ranked.slice(0, limit).map(r => r.item);
  }
}
