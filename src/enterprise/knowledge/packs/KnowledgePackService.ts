import { KnowledgeItem, KnowledgeCategory } from './KnowledgePackModel';
import { KnowledgePackRepository } from './KnowledgePackRepository';
import { KnowledgeContextEngine } from '../engine/KnowledgeContextEngine';
import { EvaluationContext } from '../engine/KnowledgeMatcher';

export class KnowledgePackService {
  private engine = new KnowledgeContextEngine();

  constructor(private repository: KnowledgePackRepository) {}

  async initialize() {
    await this.repository.initialize();
  }

  search(query: string): KnowledgeItem[] {
    const q = query.toLowerCase();
    return this.repository.getAllItems().filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.recommendedText.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  getByCategory(category: KnowledgeCategory): KnowledgeItem[] {
    return this.repository.getAllItems().filter(item => item.category === category);
  }

  match(category: KnowledgeCategory, context: EvaluationContext): KnowledgeItem[] {
    const items = this.getByCategory(category);
    return this.engine.topSuggestions(items, context, 10);
  }
}
