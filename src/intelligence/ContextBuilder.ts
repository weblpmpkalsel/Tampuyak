import { AnnualPlanningActivity } from '../models/AnnualPlanningModel';
import { PlanningContext } from '../models/PlanningContext';
import { RuleInjector } from './RuleInjector';

export class ContextBuilder {
  private ruleInjector: RuleInjector;

  constructor() {
    this.ruleInjector = new RuleInjector();
  }

  /**
   * Collect all operational information required for planning.
   * Does NOT generate prompts. Only prepares structured context.
   */
  public buildContext(activity: AnnualPlanningActivity, academicYear: string): PlanningContext {
    return {
      contextId: `ctx-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}`,
      academicYear,
      targetActivity: activity,
      activeRules: this.ruleInjector.getActiveRules(),
      planningMetadata: {},
      generatedAt: Date.now()
    };
  }
}
