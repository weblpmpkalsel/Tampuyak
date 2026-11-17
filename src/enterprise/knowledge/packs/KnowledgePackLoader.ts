import { KnowledgePack } from './KnowledgePackModel';
import { KnowledgePackRegistry } from './KnowledgePackRegistry';

export class KnowledgePackLoader {
  static async load(packId: string): Promise<KnowledgePack | null> {
    const registration = KnowledgePackRegistry.getRegistration(packId);
    if (!registration) {
      return null;
    }
    try {
      const rawData = await registration.loader();
      // Optionally validate the raw JSON structure here against KnowledgePack schema
      return rawData as KnowledgePack;
    } catch (error) {
      console.error(`Failed to load knowledge pack ${packId}:`, error);
      return null;
    }
  }

  static async loadAll(): Promise<KnowledgePack[]> {
    const registrations = KnowledgePackRegistry.getAllRegistrations();
    const packs: KnowledgePack[] = [];
    for (const reg of registrations) {
      const pack = await this.load(reg.id);
      if (pack) {
        packs.push(pack);
      }
    }
    return packs;
  }
}
