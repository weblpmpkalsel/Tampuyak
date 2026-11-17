
import { ComplianceRule, ComplianceContext } from '../contracts/ComplianceRule';
import { ComplianceReport } from '../contracts/ComplianceReport';
import { ComplianceIssue } from '../contracts/ComplianceIssue';
import { RuleRegistry } from '../registry/RuleRegistry';

export class ComplianceEngine {
  private rules: ComplianceRule[] = [];

  constructor() {
    this.rules = [...RuleRegistry];
  }

  public execute(context: ComplianceContext): ComplianceReport {
    const issues: ComplianceIssue[] = [];
    
    for (const rule of this.rules) {
      if (context.documentType === 'KSP' && rule.appliesTo === 'KSP') {
        const issue = rule.validate(context);
        if (issue) {
          issues.push(issue);
        }
      }
    }

    const totalCriticalOrBlocker = this.rules.filter(r => r.severity === 'Blocking' && r.appliesTo === context.documentType).length;
    const failedCriticalOrBlocker = issues.filter(i => i.severity === 'Blocking').length;
    
    const complianceScore = totalCriticalOrBlocker > 0 
      ? Math.round(((totalCriticalOrBlocker - failedCriticalOrBlocker) / totalCriticalOrBlocker) * 100) 
      : 100;

    const completionScore = 80;
    const releaseReadiness = failedCriticalOrBlocker === 0;

    return {
      timestamp: new Date().toISOString(),
      complianceScore,
      completionScore,
      releaseReadiness,
      issues
    };
  }
}

export const enterpriseComplianceEngine = new ComplianceEngine();
