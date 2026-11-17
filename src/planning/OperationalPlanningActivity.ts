export interface OperationalPlanningActivity {
  operationalPlanningId: string;
  activityReferenceId: string;
  programReferenceId: string;
  planningYear: 'Y1' | 'Y2' | 'Y3' | 'Y4';
  semester: 1 | 2;
  quarter: 1 | 2 | 3 | 4;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sequence: number;
  dependencyReferences: string[];
  recommendationReferences: string[];
  executionReference: string | null;
  status: 'DRAFT' | 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';
  metadata: Record<string, any>;
}
