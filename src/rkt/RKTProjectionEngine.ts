import { RKTProjection } from './RKTProjection';
import { RKTProjectionResult } from './RKTProjectionResult';
import { RKTContext } from './RKTContext';
import { OperationalPlanningActivity } from '../planning/OperationalPlanningActivity';
import { PlanningAssignment } from '../planning/PlanningAssignment';
import { KnowledgeGraph, CanonicalObject } from '../SPKG';

export class RKTProjectionEngine {
  
  /**
   * Projects one operational year from the locked RKJM Operational Planning structure.
   * 
   * @param targetYear The year to project (1, 2, 3, or 4)
   * @param operationalActivities All operational activities from the locked RKJM
   * @param assignments The corresponding planning assignments
   * @param knowledgeGraph The knowledge graph instance to resolve references
   * @param snapshotVersion Version of the RKJM snapshot being projected
   * @param userId The user projecting the RKT
   * @returns RKTProjectionResult containing the projected activities
   */
  public projectYear(
    targetYear: 1 | 2 | 3 | 4,
    operationalActivities: OperationalPlanningActivity[],
    assignments: PlanningAssignment[],
    knowledgeGraph: KnowledgeGraph,
    snapshotVersion: string,
    userId: string
  ): RKTProjectionResult {
    
    const yearLabel = `Y${targetYear}` as 'Y1' | 'Y2' | 'Y3' | 'Y4';
    
    const context: RKTContext = {
      planningYear: yearLabel,
      rkjmSnapshotVersion: snapshotVersion,
      generatedAt: Date.now(),
      generatedBy: userId
    };
    
    // Filter to only activities assigned to the target year
    const targetActivities = operationalActivities.filter(a => a.planningYear === yearLabel);
    
    const projections: RKTProjection[] = targetActivities.map(opActivity => {
      // Find assignment
      const assignment = assignments.find(a => a.activityReferenceId === opActivity.activityReferenceId);
      
      // Resolve from KG
      const kgActivity = knowledgeGraph.getNode(opActivity.activityReferenceId);
      const kgProgram = knowledgeGraph.getNode(opActivity.programReferenceId);
      
      let objectiveId: string | undefined = undefined;
      if (kgProgram && kgProgram.parentId) {
         objectiveId = kgProgram.parentId;
      } else if (kgProgram?.data?.objectiveId || kgProgram?.data?.rkjmObjectiveId) {
         objectiveId = kgProgram.data.objectiveId || kgProgram.data.rkjmObjectiveId;
      }
      
      const isValidTitle = (title: string | undefined, invalidMarker: string) => title && title !== invalidMarker && title !== 'Unknown';
      const programName = kgProgram?.title ? kgProgram.title : (opActivity.metadata?.programName || opActivity.metadata?.program || undefined);
      const activityName = kgActivity?.title ? kgActivity.title : (opActivity.metadata?.activityName || opActivity.metadata?.activity || undefined);
      
      // Extract target, success indicator, PIC, budget, monitoring
      const kgData = kgActivity?.data || {};
      const metaData = opActivity.metadata || {};
      
      const target = kgData.target || kgData.targetPencapaian || metaData.target || metaData.targetPencapaian || 'Belum ditetapkan';
      const successIndicator = kgData.performanceIndicator || kgData.indikatorKeberhasilan || kgData.successIndicator || metaData.performanceIndicator || metaData.indikatorKeberhasilan || metaData.successIndicator || 'Belum ditetapkan';
      const personInCharge = kgData.personInCharge || kgData.penanggungJawab || kgData.responsiblePerson || metaData.personInCharge || metaData.penanggungJawab || metaData.responsiblePerson || 'Belum ditetapkan';
      
      // Budget reference (this could be a cost, funding source, or budget ID)
      const budgetRef = kgData.budgetReference || kgData.fundingSource || kgData.estimatedCost || metaData.budgetReference || metaData.fundingSource || metaData.estimatedCost || 'Belum ditetapkan';
      
      // Monitoring reference (this could be frequency, evidence, or monitoring ID)
      const monitoringRef = kgData.monitoringReference || kgData.monitoringFrequency || metaData.monitoringReference || metaData.monitoringFrequency || 'Belum ditetapkan';
      
      return {
        programName,
        activityName,
        target,
        successIndicator,
        personInCharge,
        implementationYear: opActivity.planningYear,
        quarter: assignment?.quarter || opActivity.quarter || 1,
        semester: assignment?.semester || opActivity.semester || 1,
        budgetReference: budgetRef,
        monitoringReference: monitoringRef,
        planningAssignmentId: assignment?.assignmentId || 'UNASSIGNED',
        
        strategicObjectiveId: objectiveId,
        programId: opActivity.programReferenceId,
        activityId: opActivity.activityReferenceId
      };
    });
    
    return {
      context,
      projections,
      totalActivities: projections.length
    };
  }
}
