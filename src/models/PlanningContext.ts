import { AnnualPlanningActivity } from './AnnualPlanningModel';
import { BusinessRule } from './BusinessRule';

export interface PlanningContext {
  contextId: string;
  academicYear: string;
  targetActivity: AnnualPlanningActivity;
  activeRules: BusinessRule[];
  planningMetadata: Record<string, any>;
  generatedAt: number;
}
