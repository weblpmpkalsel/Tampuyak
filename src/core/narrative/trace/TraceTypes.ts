export enum TraceSourceType {
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH',
  PLANNING_SNAPSHOT = 'PLANNING_SNAPSHOT',
  ANNUAL_PLANNING = 'ANNUAL_PLANNING',
  SCHOOL_PROFILE = 'SCHOOL_PROFILE',
  VISION = 'VISION',
  MISSION = 'MISSION',
  GOALS = 'GOALS',
  PROGRAMS = 'PROGRAMS',
  ACTIVITIES = 'ACTIVITIES',
  INDICATORS = 'INDICATORS',
  TARGETS = 'TARGETS',
  BUDGET = 'BUDGET',
  TIMELINE = 'TIMELINE',
  BUSINESS_RULES = 'BUSINESS_RULES',
  RECOMMENDATIONS = 'RECOMMENDATIONS',
  EXECUTION_SUMMARY = 'EXECUTION_SUMMARY',
  EVIDENCE = 'EVIDENCE',
  ACADEMIC_YEAR = 'ACADEMIC_YEAR',
  CUSTOM = 'CUSTOM'
}

export interface TraceReference {
  traceId: string;
  sourceType: TraceSourceType | string;
  sourceId: string;
  sourcePath?: string;
  sourceVersion?: string;
  snapshotId?: string;
  createdFrom?: string;
  generatedBy?: string;
  timestamp: number;
  confidence: number;
}

export interface TraceNode {
  nodeId: string;
  references: TraceReference[];
  parentIds: string[];
  childIds: string[];
}

export interface TraceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
