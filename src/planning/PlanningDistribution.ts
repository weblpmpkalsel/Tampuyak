export interface PlanningDistribution {
  planningYear: number;
  activityReferenceId: string;
  priorityOrder: number;
  dependencyReferences: string[];
  recommendedQuarter: 1 | 2 | 3 | 4;
  recommendedSemester: 1 | 2;
  recommendedSequence: number;
  metadata?: Record<string, any>;
}
