import { KnowledgeRelationType } from './KnowledgeRelationType';

export interface KnowledgeRelation {
  sourceId: string;
  targetId: string;
  relationType: KnowledgeRelationType;
  metadata?: Record<string, any>;
}
