export type KnowledgeSource = 'OFFICIAL' | 'BEST_PRACTICE' | 'REGIONAL' | 'SCHOOL_CUSTOM';

export type KnowledgeCategory = 
  | 'STUDENT_CHARACTERISTICS'
  | 'TEACHER_CHARACTERISTICS'
  | 'PARENT_CHARACTERISTICS'
  | 'SCHOOL_ENVIRONMENT'
  | 'SCHOOL_VISION'
  | 'SCHOOL_MISSION'
  | 'SCHOOL_GOALS'
  | 'LEARNING_ORGANIZATION'
  | 'LEARNING_LOAD'
  | 'INTRACURRICULAR'
  | 'COCURRICULAR'
  | 'EXTRACURRICULAR'
  | 'PROFESSIONAL_DEVELOPMENT'
  | 'EVALUATION'
  | 'STRATEGIC_VISION';

export interface KnowledgeContext {
  educationLevel?: string[];
  phase?: string[];
  schoolLocation?: string[];
  schoolType?: string[];
  region?: string[];
  tags?: string[];
  governmentVersion?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  source: KnowledgeSource;
  version: string;
  tags: string[];
  contexts: KnowledgeContext;
  recommendedText: string;
  references?: string[];
  priority: number;
}

export interface KnowledgePack {
  id: string;
  domain: string;
  title: string;
  description: string;
  version: string;
  items: KnowledgeItem[];
}
