export type ValidationSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
export type ValidationStatus = 'PASS' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface ValidationIssue {
  field: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationRuleResult {
  ruleId: string;
  passed: boolean;
  issues: ValidationIssue[];
}

export interface ValidationDomainResult {
  domain: string;
  category: ValidationCategory;
  status: ValidationStatus;
  ruleResults: ValidationRuleResult[];
}

export type ValidationCategory = 'BAB_I' | 'BAB_II' | 'BAB_III' | 'BAB_IV' | 'BAB_V' | 'GENERAL';

export interface ValidationSummary {
  overallStatus: ValidationStatus;
  totalIssues: number;
  criticalCount: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  domainResults: ValidationDomainResult[];
}

export interface EnterpriseValidationRule<T> {
  id: string;
  name: string;
  category: ValidationCategory;
  evaluate: (data: T) => ValidationRuleResult;
}
