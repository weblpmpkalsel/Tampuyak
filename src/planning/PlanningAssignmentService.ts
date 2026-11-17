import { PlanningAssignment } from './PlanningAssignment';
import { PlanningAssignmentResult } from './PlanningAssignmentResult';
import { PlanningDistribution } from './PlanningDistribution';
import { PlanningRecommendation } from './PlanningRecommendation';

export class PlanningAssignmentService {
  /**
   * Determines the operational planning assignment for an activity based on
   * business rules, explicitly provided distribution, and recommendations.
   * 
   * This is a decision service. It does not mutate execution state or distribute activities.
   */
  public determineAssignment(
    annualPlanningActivity: any, // Referencing the strategic domain activity
    distribution: PlanningDistribution | undefined,
    recommendations: PlanningRecommendation[] | undefined,
    businessRules: any,
    context: any
  ): PlanningAssignmentResult {
    try {
      if (!annualPlanningActivity || !annualPlanningActivity.id) {
        throw new Error("Invalid AnnualPlanningActivity: missing ID");
      }

      // Determine year based on explicit distribution or default logic.
      const year = distribution && distribution.planningYear >= 1 && distribution.planningYear <= 4
        ? `Y${distribution.planningYear}` as 'Y1' | 'Y2' | 'Y3' | 'Y4'
        : 'Y1';

      // Determine priority from recommendations or default
      let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
      if (recommendations && recommendations.length > 0) {
        const crit = recommendations.find(r => r.priority === 'CRITICAL');
        const high = recommendations.find(r => r.priority === 'HIGH');
        if (crit) priority = 'CRITICAL';
        else if (high) priority = 'HIGH';
      }

      const assignment: PlanningAssignment = {
        assignmentId: `ASSIGN-${annualPlanningActivity.id}-${Date.now()}`,
        activityReferenceId: annualPlanningActivity.id,
        planningCycleId: context?.planningCycleId || 'CYCLE-DEFAULT',
        planningSnapshotVersion: context?.planningSnapshotVersion || '1.0.0',
        planningYear: year,
        semester: distribution?.recommendedSemester || 1,
        quarter: distribution?.recommendedQuarter || 1,
        priority: priority,
        sequence: distribution?.recommendedSequence || 1,
        dependencyReferences: distribution?.dependencyReferences || [],
        recommendationReferences: recommendations?.map(r => r.recommendationId) || [],
        assignmentStatus: 'DRAFT',
        assignmentSource: distribution ? 'BUSINESS_RULES' : 'DEFAULT',
        assignmentReason: distribution ? 'Assigned based on explicitly provided planning distribution.' : 'Default assignment applied.',
        createdAt: Date.now(),
        createdBy: context?.userId || 'SYSTEM',
        businessRuleVersion: businessRules?.version || '1.0.0',
        assignmentVersion: '1.0.0',
        schemaVersion: '1.0.0',
        metadata: {}
      };

      return {
        success: true,
        assignment,
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}
