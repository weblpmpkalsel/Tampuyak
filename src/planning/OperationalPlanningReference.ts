export interface OperationalPlanningReference {
  referenceId: string;
  referenceType: 'ACTIVITY' | 'PROGRAM' | 'EXECUTION' | 'RECOMMENDATION' | 'DEPENDENCY';
  targetId: string;
  metadata?: Record<string, any>;
}
