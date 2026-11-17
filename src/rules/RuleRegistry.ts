import { BusinessRule, RuleCategory } from '../models/BusinessRule';

export class RuleRegistry {
  private static instance: RuleRegistry;
  private rules: Map<string, BusinessRule> = new Map();

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): RuleRegistry {
    if (!RuleRegistry.instance) {
      RuleRegistry.instance = new RuleRegistry();
    }
    return RuleRegistry.instance;
  }

  private initializeDefaultRules() {
    // Priority Rules
    this.registerRule({
      id: 'PR-001',
      name: 'High Priority Criteria',
      description: 'Defines what constitutes a High Priority planning item.',
      category: 'Priority',
      severity: 'Info',
      priority: 1,
      enabled: true,
      version: '1.0.0',
      createdDate: Date.now(),
      lastUpdated: Date.now()
    });

    // Timeline Rules
    this.registerRule({
      id: 'TL-001',
      name: 'Academic Calendar Constraints',
      description: 'Activities must fall within valid academic calendar periods.',
      category: 'Timeline',
      severity: 'Critical',
      priority: 2,
      enabled: true,
      version: '1.0.0',
      createdDate: Date.now(),
      lastUpdated: Date.now()
    });

    // Budget Rules
    this.registerRule({
      id: 'BD-001',
      name: 'Funding Source Required',
      description: 'Activities requiring budget must have a funding source defined.',
      category: 'Budget',
      severity: 'High',
      priority: 3,
      enabled: true,
      version: '1.0.0',
      createdDate: Date.now(),
      lastUpdated: Date.now()
    });
    
    // Validation Rules
    this.registerRule({
      id: 'VL-001',
      name: 'Responsible Person Assigned',
      description: 'Every activity must have a responsible person before approval.',
      category: 'Validation',
      severity: 'High',
      priority: 4,
      enabled: true,
      version: '1.0.0',
      createdDate: Date.now(),
      lastUpdated: Date.now()
    });
    
    // Dependency Rules
    this.registerRule({
      id: 'DP-001',
      name: 'Activity Dependencies Met',
      description: 'An activity cannot start until all dependencies are met.',
      category: 'Dependency',
      severity: 'High',
      priority: 5,
      enabled: true,
      version: '1.0.0',
      createdDate: Date.now(),
      lastUpdated: Date.now()
    });
    
    // Compliance Rules
    this.registerRule({
      id: 'CM-001',
      name: 'Regulation Adherence',
      description: 'Activity planning aligns with internal standards and operational guidelines.',
      category: 'Compliance',
      severity: 'Medium',
      priority: 6,
      enabled: true,
      version: '1.0.0',
      createdDate: Date.now(),
      lastUpdated: Date.now()
    });
  }

  public registerRule(rule: BusinessRule): void {
    this.rules.set(rule.id, rule);
  }

  public getRule(id: string): BusinessRule | undefined {
    return this.rules.get(id);
  }

  public getAllRules(): BusinessRule[] {
    return Array.from(this.rules.values());
  }

  public getRulesByCategory(category: RuleCategory): BusinessRule[] {
    return this.getAllRules().filter(rule => rule.category === category);
  }

  public getEnabledRules(): BusinessRule[] {
    return this.getAllRules().filter(rule => rule.enabled);
  }
}
