import { KnowledgePackRegistry } from '../../KnowledgePackRegistry';

export function registerOfficialPacks() {
  KnowledgePackRegistry.register({
    id: 'official_kosp_pack_2026',
    domain: 'KOSP',
    loader: async () => {
      const module = await import('./kosp2026');
      return module.officialKospPack2026;
    }
  });
}
