import { EnterpriseKnowledgeType } from '../types/EnterpriseKnowledgeType';

export class EnterpriseKnowledgeRegistry {
  private static instance: EnterpriseKnowledgeRegistry;
  private knowledgeTypes: Map<string, EnterpriseKnowledgeType> = new Map();

  private constructor() {}

  public static getInstance(): EnterpriseKnowledgeRegistry {
    if (!EnterpriseKnowledgeRegistry.instance) {
      EnterpriseKnowledgeRegistry.instance = new EnterpriseKnowledgeRegistry();
    }
    return EnterpriseKnowledgeRegistry.instance;
  }

  public register(knowledgeType: EnterpriseKnowledgeType): void {
    if (this.knowledgeTypes.has(knowledgeType.id)) {
      throw new Error(`Knowledge Type with ID ${knowledgeType.id} is already registered.`);
    }
    this.knowledgeTypes.set(knowledgeType.id, knowledgeType);
  }

  public find(id: string): EnterpriseKnowledgeType | undefined {
    return this.knowledgeTypes.get(id);
  }

  public list(): EnterpriseKnowledgeType[] {
    return Array.from(this.knowledgeTypes.values());
  }

  public filter(predicate: (type: EnterpriseKnowledgeType) => boolean): EnterpriseKnowledgeType[] {
    return this.list().filter(predicate);
  }

  public clear(): void {
    this.knowledgeTypes.clear();
  }
}
