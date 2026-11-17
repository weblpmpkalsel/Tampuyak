import { PedagogicalKnowledgeGraph } from './PedagogicalKnowledgeGraph';
import { KnowledgeRelationType } from './KnowledgeRelationType';

export const pedagogicalKnowledgeGraph = new PedagogicalKnowledgeGraph([
  // Example: Learning Need -> Visual
  { sourceId: 'LN-VIS-001', targetId: 'RES-IMAGES', relationType: KnowledgeRelationType.RECOMMENDED_WITH },
  { sourceId: 'LN-VIS-001', targetId: 'RES-INFOGRAPHICS', relationType: KnowledgeRelationType.RECOMMENDED_WITH },
  { sourceId: 'LN-VIS-001', targetId: 'RES-VIDEO', relationType: KnowledgeRelationType.RECOMMENDED_WITH },
  { sourceId: 'LN-VIS-001', targetId: 'RES-MINDMAPS', relationType: KnowledgeRelationType.RECOMMENDED_WITH },

  // Example: Learning Need -> Project Based
  { sourceId: 'LN-PROJ-001', targetId: 'SKILL-CREATIVITY', relationType: KnowledgeRelationType.STRENGTHENS },
  { sourceId: 'LN-PROJ-001', targetId: 'SKILL-COLLABORATION', relationType: KnowledgeRelationType.STRENGTHENS },
  { sourceId: 'LN-PROJ-001', targetId: 'SKILL-COMMUNICATION', relationType: KnowledgeRelationType.STRENGTHENS },

  // Example: Student Potential -> Leadership
  { sourceId: 'POT-LDR-001', targetId: 'SKILL-COMMUNICATION', relationType: KnowledgeRelationType.DEVELOPS },
  { sourceId: 'POT-LDR-001', targetId: 'SKILL-COLLABORATION', relationType: KnowledgeRelationType.DEVELOPS },
  { sourceId: 'POT-LDR-001', targetId: 'SKILL-RESPONSIBILITY', relationType: KnowledgeRelationType.DEVELOPS },

  // Example: Government Policy -> Deep Learning
  { sourceId: 'GOV-DEEP-LEARNING', targetId: 'SKILL-UNDERSTANDING', relationType: KnowledgeRelationType.SUPPORTS },
  { sourceId: 'GOV-DEEP-LEARNING', targetId: 'SKILL-APPLYING', relationType: KnowledgeRelationType.SUPPORTS },
  { sourceId: 'GOV-DEEP-LEARNING', targetId: 'SKILL-REFLECTING', relationType: KnowledgeRelationType.SUPPORTS },

  // Example: Government Policy -> 8 Dimensi Profil Lulusan
  { sourceId: 'GOV-8-DIMENSI', targetId: 'POT-INT-001', relationType: KnowledgeRelationType.CONNECTED_TO },
  { sourceId: 'GOV-8-DIMENSI', targetId: 'POT-LOG-001', relationType: KnowledgeRelationType.CONNECTED_TO },
  { sourceId: 'GOV-8-DIMENSI', targetId: 'LC-SOC-001', relationType: KnowledgeRelationType.CONNECTED_TO }
]);
