export interface PlanningYear {
  yearNumber: number;
  academicYear: string;
  planningStatus: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  referencedProgramIds: string[];
  referencedActivityIds: string[];
  summaryMetadata: {
    totalReferencedActivities: number;
    totalReferencedPrograms: number;
    estimatedBudget?: number;
    tags?: string[];
  };
}
