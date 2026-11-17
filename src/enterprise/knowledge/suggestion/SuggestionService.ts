import { KnowledgePackRepository } from '../packs/KnowledgePackRepository';
import { SuggestionEngine } from './SuggestionEngine';
import { SuggestionRequest, SuggestionResult } from './SuggestionModel';
import { KnowledgeCategory } from '../packs/KnowledgePackModel';

export class SuggestionService {
  private engine = new SuggestionEngine();

  constructor(private repository: KnowledgePackRepository) {}

  getSuggestions(request: SuggestionRequest, limit: number = 5): SuggestionResult[] {
    const items = this.repository.getAllItems().filter(item => item.category === request.category);
    return this.engine.process(items, request, limit);
  }

  getTopSuggestions(request: SuggestionRequest): SuggestionResult[] {
    return this.getSuggestions(request, 3);
  }

  getCategorySuggestions(category: KnowledgeCategory, request: Omit<SuggestionRequest, 'category'>): SuggestionResult[] {
    return this.getSuggestions({ ...request, category }, 10);
  }

  getAlternativeSuggestions(request: SuggestionRequest, currentSuggestionId: string): SuggestionResult[] {
    const items = this.repository.getAllItems().filter(item => item.category === request.category && item.id !== currentSuggestionId);
    return this.engine.process(items, request, 5);
  }

  getRelatedSuggestions(request: SuggestionRequest, tags: string[]): SuggestionResult[] {
    const items = this.repository.getAllItems().filter(item => item.category === request.category);
    
    const enhancedRequest = {
      ...request,
      context: {
        ...request.context,
        tags: [...(request.context.tags || []), ...tags]
      }
    };
    return this.engine.process(items, enhancedRequest, 5);
  }
}
