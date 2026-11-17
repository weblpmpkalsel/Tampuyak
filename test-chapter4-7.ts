import { PlanningDistributionService } from './src/planning/PlanningDistributionService.ts';
const s = new PlanningDistributionService();
console.log(s.assignYearToActivity("a", 0));
console.log(s.assignYearToActivity("b", 1));
