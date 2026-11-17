import { EnterpriseKnowledgeRegistry } from '../registry/EnterpriseKnowledgeRegistry';
import { EnterpriseKnowledgeType } from '../types/EnterpriseKnowledgeType';
import { EnterpriseKnowledgeDomain } from '../types/EnterpriseKnowledgeDomain';
import { EnterpriseKnowledgeCategory } from '../types/EnterpriseKnowledgeCategory';
import { EnterpriseKnowledgeCapability } from '../types/EnterpriseKnowledgeCapability';

export class EnterpriseKnowledgeService {
  private get registry() {
    return EnterpriseKnowledgeRegistry.getInstance();
  }

  public getById(id: string): EnterpriseKnowledgeType | undefined {
    return this.registry.find(id);
  }

  public getByDomain(domain: EnterpriseKnowledgeDomain): EnterpriseKnowledgeType[] {
    return this.registry.filter(type => type.domain === domain);
  }

  public getByCategory(category: EnterpriseKnowledgeCategory): EnterpriseKnowledgeType[] {
    return this.registry.filter(type => type.category === category);
  }

  public getCapabilities(id: string): EnterpriseKnowledgeCapability[] {
    const type = this.getById(id);
    return type ? type.capabilities : [];
  }

  public search(query: string): EnterpriseKnowledgeType[] {
    const lowerQuery = query.toLowerCase();
    return this.registry.filter(type => 
      type.displayName.toLowerCase().includes(lowerQuery) || 
      type.description.toLowerCase().includes(lowerQuery) ||
      type.governmentPolicyTags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
