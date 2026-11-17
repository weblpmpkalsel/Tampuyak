export interface RKTProjection {
  programName: string;
  activityName: string;
  target: string;
  successIndicator: string;
  personInCharge: string;
  implementationYear: 'Y1' | 'Y2' | 'Y3' | 'Y4';
  quarter: number;
  semester: number;
  budgetReference: string;
  monitoringReference: string;
  planningAssignmentId: string;
  
  // Original references
  strategicObjectiveId: string;
  programId: string;
  activityId: string;
}
