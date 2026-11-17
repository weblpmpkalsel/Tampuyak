import { OperationalPlanningActivity } from './OperationalPlanningActivity';
import { PlanningDistribution } from './PlanningDistribution';

export class OperationalPlanningMapper {
  /**
   * Maps a PlanningDistribution (metadata) to an OperationalPlanningActivity,
   * injecting the required IDs and default operational properties.
   * This bridges the distribution logic to the operational execution domain.
   */
  public static fromDistribution(
    operationalId: string,
    programRefId: string,
    distribution: PlanningDistribution
  ): OperationalPlanningActivity {
    return {
      operationalPlanningId: operationalId,
      activityReferenceId: distribution.activityReferenceId,
      programReferenceId: programRefId,
      planningYear: `Y${distribution.planningYear}` as 'Y1' | 'Y2' | 'Y3' | 'Y4',
      semester: distribution.recommendedSemester,
      quarter: distribution.recommendedQuarter,
      priority: 'MEDIUM',
      sequence: distribution.recommendedSequence,
      dependencyReferences: distribution.dependencyReferences || [],
      recommendationReferences: [],
      executionReference: null,
      status: 'PLANNED',
      metadata: distribution.metadata || {}
    };
  }
}
