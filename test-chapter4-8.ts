import { PlanningDistributionService } from './src/planning/PlanningDistributionService.ts';
import { PlanningAssignmentService } from './src/planning/PlanningAssignmentService.ts';

const d = new PlanningDistributionService();
const a = new PlanningAssignmentService();
const distYearStr = d.assignYearToActivity("a", 0);
const distribution = {
  planningYear: parseInt(distYearStr.replace('Y', '')),
  activityReferenceId: "a",
  priorityOrder: 1,
  dependencyReferences: [],
  recommendedQuarter: 1,
  recommendedSemester: 1,
  recommendedSequence: 1
};
const assignmentResult = a.determineAssignment({id: "a", status: "draft"}, distribution, undefined, undefined, {});
console.log(assignmentResult);
