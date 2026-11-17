import { RuleRegistry } from './RuleRegistry';
import { BusinessRule, RuleCategory } from '../models/BusinessRule';
import { RuleResult, ValidationSummary, RuleValidationStatus } from '../models/RuleResult';
import { AnnualPlanningActivity } from '../models/AnnualPlanningModel';

export class BusinessRulesEngine {
  private static instance: BusinessRulesEngine;
  private registry: RuleRegistry;

  private constructor() {
    this.registry = RuleRegistry.getInstance();
  }

  public static getInstance(): BusinessRulesEngine {
    if (!BusinessRulesEngine.instance) {
      BusinessRulesEngine.instance = new BusinessRulesEngine();
    }
    return BusinessRulesEngine.instance;
  }

  /**
   * Retrieves the underlying Rule Registry.
   */
  public getRegistry(): RuleRegistry {
    return this.registry;
  }

  /**
   * Evaluates a rule.
   * This is a metadata/policy layer, not an AI engine. 
   * Provides placeholder structural logic for actual validation.
   */
  private evaluateRule(rule: BusinessRule, activity: AnnualPlanningActivity): RuleResult {
    let status: RuleValidationStatus = 'Passed';
    let message = `Rule ${rule.id} evaluated successfully.`;
    let recommendation: string | undefined = undefined;

    // Provide baseline structural evaluation without executing complex AI
    if (rule.category === 'Budget' && rule.id === 'BD-001') {
      if (activity.budgetReference && !activity.budgetReference.fundingSource) {
        status = 'Failed';
        message = 'Funding source is missing for activity requiring budget.';
        recommendation = 'Please assign a valid funding source.';
      }
    }
    
    if (rule.category === 'Validation' && rule.id === 'VL-001') {
       if (activity.responsibility && !activity.responsibility.responsiblePerson) {
          status = 'Warning';
          message = 'Responsible person is not assigned.';
          recommendation = 'Assign a responsible person to proceed to approval.';
       }
    }

    return {
      ruleId: rule.id,
      status,
      message,
      recommendation
    };
  }

  /**
   * Validates an activity against all enabled rules.
   */
  public validateActivity(activity: AnnualPlanningActivity): ValidationSummary {
    const enabledRules = this.registry.getEnabledRules();
    const passedRules: RuleResult[] = [];
    const failedRules: RuleResult[] = [];
    const warnings: RuleResult[] = [];
    const recommendations: RuleResult[] = [];

    let isValid = true;

    for (const rule of enabledRules) {
      const result = this.evaluateRule(rule, activity);

      if (result.status === 'Passed') {
        passedRules.push(result);
      } else if (result.status === 'Failed') {
        failedRules.push(result);
        if (rule.severity === 'Critical' || rule.severity === 'High') {
          isValid = false;
        }
      } else if (result.status === 'Warning') {
        warnings.push(result);
      }

      if (result.recommendation) {
        recommendations.push(result);
      }
    }

    return {
      targetId: activity.id,
      timestamp: Date.now(),
      passedRules,
      failedRules,
      warnings,
      recommendations,
      isValid
    };
  }
  
  /**
   * Evaluates rules for a specific category only.
   */
  public validateCategory(activity: AnnualPlanningActivity, category: RuleCategory): ValidationSummary {
    const rules = this.registry.getRulesByCategory(category).filter(r => r.enabled);
    const passedRules: RuleResult[] = [];
    const failedRules: RuleResult[] = [];
    const warnings: RuleResult[] = [];
    const recommendations: RuleResult[] = [];

    let isValid = true;

    for (const rule of rules) {
      const result = this.evaluateRule(rule, activity);

      if (result.status === 'Passed') {
        passedRules.push(result);
      } else if (result.status === 'Failed') {
        failedRules.push(result);
        if (rule.severity === 'Critical' || rule.severity === 'High') {
          isValid = false;
        }
      } else if (result.status === 'Warning') {
        warnings.push(result);
      }

      if (result.recommendation) {
        recommendations.push(result);
      }
    }

    return {
      targetId: activity.id,
      timestamp: Date.now(),
      passedRules,
      failedRules,
      warnings,
      recommendations,
      isValid
    };
  }
}
