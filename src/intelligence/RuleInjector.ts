import { BusinessRulesEngine } from '../rules/BusinessRulesEngine';
import { BusinessRule } from '../models/BusinessRule';

/**
 * Injects Business Rules into every planning request.
 */
export class RuleInjector {
  private rulesEngine: BusinessRulesEngine;

  constructor() {
    this.rulesEngine = BusinessRulesEngine.getInstance();
  }

  public getActiveRules(): BusinessRule[] {
    // Only return enabled rules to be injected into the prompt
    return this.rulesEngine.getRegistry().getEnabledRules();
  }
}
