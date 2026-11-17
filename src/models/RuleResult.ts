import { BusinessRule } from './BusinessRule';

export type RuleValidationStatus = 'Passed' | 'Failed' | 'Warning' | 'NotApplicable';

export interface RuleResult {
  ruleId: string;
  status: RuleValidationStatus;
  message: string;
  recommendation?: string;
  metadata?: Record<string, any>;
}

export interface ValidationSummary {
  targetId: string; // ID of the object being validated (e.g., Activity ID)
  timestamp: number;
  
  passedRules: RuleResult[];
  failedRules: RuleResult[];
  warnings: RuleResult[];
  recommendations: RuleResult[];
  
  isValid: boolean; // True if no 'Failed' critical rules
}
