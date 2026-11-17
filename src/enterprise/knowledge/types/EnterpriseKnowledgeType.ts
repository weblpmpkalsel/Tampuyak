import { EnterpriseKnowledgeDomain } from './EnterpriseKnowledgeDomain';
import { EnterpriseKnowledgeCategory } from './EnterpriseKnowledgeCategory';
import { EnterpriseKnowledgeCapability } from './EnterpriseKnowledgeCapability';

export interface EnterpriseKnowledgeType {
  id: string; // Knowledge Type ID
  displayName: string;
  description: string;
  domain: EnterpriseKnowledgeDomain;
  category: EnterpriseKnowledgeCategory;
  capabilities: EnterpriseKnowledgeCapability[];
  lifecycleSupport: boolean;
  governmentPolicyTags: string[]; // Kemendikdasmen, BSKAP, Deep Learning, 8 Dimensi Profil Lulusan, etc.
  versionSupport: boolean;
}
