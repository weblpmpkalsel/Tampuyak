import { 
  ValidationSummary, 
  ValidationDomainResult, 
  EnterpriseValidationRule, 
  ValidationStatus,
  ValidationCategory
} from './EnterpriseValidationTypes';
import { KspMetadata } from '../../ksp/KspMetadataAdapter';

export class EnterpriseValidationService {
  private rules: EnterpriseValidationRule<any>[] = [];

  registerRule(rule: EnterpriseValidationRule<any>) {
    this.rules.push(rule);
  }

  registerRules(rules: EnterpriseValidationRule<any>[]) {
    this.rules.push(...rules);
  }

  validate(metadata: KspMetadata): ValidationSummary {
    const domainResults: ValidationDomainResult[] = [];
    let criticalCount = 0;
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    let overallStatus: ValidationStatus = 'PASS';

    // Group rules by domain/category
    const rulesByCategory = this.rules.reduce((acc, rule) => {
      if (!acc[rule.category]) acc[rule.category] = [];
      acc[rule.category].push(rule);
      return acc;
    }, {} as Record<string, EnterpriseValidationRule<any>[]>);

    for (const [category, rules] of Object.entries(rulesByCategory)) {
      const ruleResults = [];
      let categoryStatus: ValidationStatus = 'PASS';

      for (const rule of rules) {
        const result = rule.evaluate(metadata);
        ruleResults.push(result);

        for (const issue of result.issues) {
          if (issue.severity === 'CRITICAL') {
            criticalCount++;
            categoryStatus = 'CRITICAL';
            overallStatus = 'CRITICAL';
          } else if (issue.severity === 'ERROR') {
            errorCount++;
            if (categoryStatus !== 'CRITICAL') categoryStatus = 'ERROR';
            if (overallStatus !== 'CRITICAL') overallStatus = 'ERROR';
          } else if (issue.severity === 'WARNING') {
            warningCount++;
            if (categoryStatus === 'PASS') categoryStatus = 'WARNING';
            if (overallStatus === 'PASS') overallStatus = 'WARNING';
          } else if (issue.severity === 'INFO') {
            infoCount++;
          }
        }
      }

      domainResults.push({
        domain: category,
        category: category as ValidationCategory,
        status: categoryStatus,
        ruleResults
      });
    }

    return {
      overallStatus,
      totalIssues: criticalCount + errorCount + warningCount + infoCount,
      criticalCount,
      errorCount,
      warningCount,
      infoCount,
      domainResults
    };
  }
}
