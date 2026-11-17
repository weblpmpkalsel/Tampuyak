import { KnowledgeItem } from '../packs/KnowledgePackModel';
import { KnowledgeScore } from './KnowledgeScore';

export interface KnowledgeRanking {
  item: KnowledgeItem;
  scoreDetails: KnowledgeScore;
}
