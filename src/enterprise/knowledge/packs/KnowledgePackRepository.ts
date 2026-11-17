import { KnowledgePack, KnowledgeItem } from './KnowledgePackModel';
import { KnowledgePackLoader } from './KnowledgePackLoader';

export class KnowledgePackRepository {
  private packs: Map<string, KnowledgePack> = new Map();
  private items: KnowledgeItem[] = [];
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    const loadedPacks = await KnowledgePackLoader.loadAll();
    for (const pack of loadedPacks) {
      this.packs.set(pack.id, pack);
      this.items.push(...pack.items);
    }
    this.isInitialized = true;
  }

  getPacks(): KnowledgePack[] {
    return Array.from(this.packs.values());
  }

  getAllItems(): KnowledgeItem[] {
    return this.items;
  }

  getItemById(id: string): KnowledgeItem | undefined {
    return this.items.find(item => item.id === id);
  }
  
  getPackById(id: string): KnowledgePack | undefined {
    return this.packs.get(id);
  }
}
