export interface PlanningAssignment {
  assignmentId: string;
  activityReferenceId: string;
  planningCycleId: string;
  planningSnapshotVersion: string;
  planningYear: 'Y1' | 'Y2' | 'Y3' | 'Y4';
  semester: 1 | 2;
  quarter: 1 | 2 | 3 | 4;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sequence: number;
  dependencyReferences: string[];
  recommendationReferences: string[];
  assignmentStatus: 'DRAFT' | 'SUGGESTED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  assignmentSource: 'MANUAL' | 'BUSINESS_RULES' | 'FUTURE_AI_RECOMMENDATION' | 'IMPORTED' | 'DEFAULT';
  assignmentReason: string;
  createdAt: number;
  createdBy: string;
  approvedAt?: number;
  approvedBy?: string;
  businessRuleVersion: string;
  assignmentVersion: string;
  schemaVersion: string;
  metadata: Record<string, any>;
}
