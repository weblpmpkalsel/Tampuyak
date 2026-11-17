import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const IncompleteSectionRule: ComplianceRule = {
  id: 'ECE-003',
  title: 'Perencanaan Pembelajaran',
  category: 'Document',
  severity: 'Quality',
  appliesTo: 'KSP',
  recommendation: 'Lakukan penjabaran pada kebijakan dan mekanisme asesmen.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const learningPolicy = context.metadata?.learningPolicy;
    const isCharacteristicsValidated = learningPolicy && learningPolicy.assessmentMechanisms;
    
    if (!isCharacteristicsValidated) {
      return {
        issueId: `ISSUE-${Date.now()}-ECE-003`,
        ruleId: 'ECE-003',
        severity: 'Quality',
        title: 'Perencanaan Pembelajaran',
        description: 'Kebijakan dan mekanisme asesmen belum dijabarkan.',
        affectedModule: 'KSP',
        affectedSection: 'BAB I',
        recommendation: 'Lakukan penjabaran pada kebijakan dan mekanisme asesmen.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
