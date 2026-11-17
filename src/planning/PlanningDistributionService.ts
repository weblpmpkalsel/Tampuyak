import { OperationalPlanningEngine } from './OperationalPlanningEngine';

export class PlanningDistributionService {
  private engine?: OperationalPlanningEngine;

  constructor(engine?: OperationalPlanningEngine) {
    this.engine = engine;
  }

  /**
   * Determines the planning year ('Y1', 'Y2', 'Y3', 'Y4') for an activity.
   * If a specific distribution is registered in the engine, it uses that.
   * Otherwise, it uses a deterministic distribution logic based on index
   * to ensure activities are distributed across 4 years instead of all piling up in Y1.
   */
  public assignYearToActivity(activityReferenceId: string, fallbackIndex: number = 0): 'Y1' | 'Y2' | 'Y3' | 'Y4' {
    if (this.engine) {
      const distribution = this.engine.getPlanningDistribution(activityReferenceId);
      if (distribution && distribution.planningYear >= 1 && distribution.planningYear <= 4) {
        return `Y${distribution.planningYear}` as 'Y1' | 'Y2' | 'Y3' | 'Y4';
      }
    }

    // Default distribution if not explicitly registered: distribute evenly across 4 years (1-4)
    // Round-robin distribution
    const defaultYear = (fallbackIndex % 4) + 1;
    return `Y${defaultYear}` as 'Y1' | 'Y2' | 'Y3' | 'Y4';
  }
}
