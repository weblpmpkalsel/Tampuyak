import { KnowledgeContextEngine } from '../engine/KnowledgeContextEngine';
import { KnowledgeItem } from '../packs/KnowledgePackModel';
import { SuggestionRequest, SuggestionResult } from './SuggestionModel';
import { SuggestionStrategy, DefaultSuggestionStrategy } from './SuggestionStrategy';

export class SuggestionEngine {
  private contextEngine = new KnowledgeContextEngine();
  private strategy: SuggestionStrategy = new DefaultSuggestionStrategy();

  setStrategy(strategy: SuggestionStrategy) {
    this.strategy = strategy;
  }

  process(items: KnowledgeItem[], request: SuggestionRequest, limit: number = 5): SuggestionResult[] {
    const context = { ...request.context };
    if (request.governmentVersion) {
      context.governmentVersion = request.governmentVersion;
    }

    const matched = this.contextEngine.match(items, context);
    let ranked = this.contextEngine.rank(matched);
    
    ranked = this.strategy.filter(ranked, request);

    return ranked.slice(0, limit).map(r => this.strategy.transform(r));
  }
}
