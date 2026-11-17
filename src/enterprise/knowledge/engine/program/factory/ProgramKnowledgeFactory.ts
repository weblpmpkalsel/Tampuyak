import { EnterpriseKnowledgeType } from '../../../types/EnterpriseKnowledgeType';
import { EnterpriseKnowledgeDomain } from '../../../types/EnterpriseKnowledgeDomain';
import { EnterpriseKnowledgeCategory } from '../../../types/EnterpriseKnowledgeCategory';
import { EnterpriseKnowledgeCapability } from '../../../types/EnterpriseKnowledgeCapability';
import { ProgramKnowledgeEditor } from '../components/ProgramKnowledgeEditor';
import { ProgramKnowledgeService } from '../services/ProgramKnowledgeService';

export class ProgramKnowledgeFactory {
  private static service = new ProgramKnowledgeService();

  public static createKnowledgeType(
    id: string,
    displayName: string,
    description: string,
    domain: EnterpriseKnowledgeDomain = EnterpriseKnowledgeDomain.CURRICULUM,
    governmentPolicyTags: string[] = ['Kemendikdasmen', 'BSKAP']
  ): EnterpriseKnowledgeType {
    return {
      id,
      displayName,
      description,
      domain,
      category: EnterpriseKnowledgeCategory.PROGRAM,
      capabilities: [
        EnterpriseKnowledgeCapability.SUPPORTS_TEMPLATE,
        EnterpriseKnowledgeCapability.SUPPORTS_VERSIONING,
        EnterpriseKnowledgeCapability.SUPPORTS_APPROVAL,
        EnterpriseKnowledgeCapability.SUPPORTS_REFERENCE
      ],
      lifecycleSupport: true,
      governmentPolicyTags,
      versionSupport: true
    };
  }

  public static getService(): ProgramKnowledgeService {
    return this.service;
  }

  public static getEditorComponent() {
    return ProgramKnowledgeEditor;
  }
}
