export interface PlanningSnapshot {
  objectives: any[];
  programs: any[];
  activities: any[];
  annualPlans: any;
  planningAssignments: any[];
  operationalActivities: any[];
  metadata: any;
  version: number;
  generatedAt: string;
  hash: string;
}

export class PlanningSnapshotService {
  public createSnapshot(workspace: any): PlanningSnapshot {
    return {
      objectives: workspace.objectives || [],
      programs: workspace.programs || [],
      activities: workspace.activities || [],
      annualPlans: workspace.annualPlans || {},
      planningAssignments: workspace.planningAssignments || [],
      operationalActivities: workspace.operationalActivities || [],
      metadata: workspace.metadata || {},
      version: workspace.version || 1,
      generatedAt: new Date().toISOString(),
      hash: this.generateHash(workspace)
    };
  }

  private generateHash(workspace: any): string {
    const str = JSON.stringify({
      objectives: workspace.objectives,
      annualPlans: workspace.annualPlans
    });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
}
