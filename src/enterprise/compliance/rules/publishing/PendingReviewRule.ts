import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const PendingReviewRule: ComplianceRule = {
  id: 'ECE-005',
  title: 'Pending Review',
  category: 'Publishing',
  severity: 'Recommendation',
  appliesTo: 'KSP',
  recommendation: 'Minta Kepala Sekolah untuk mereviu draft KSP.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const isReviewed = !!context.metadata?.approval?.isReviewed;
    
    if (!isReviewed) {
      return {
        issueId: `ISSUE-${Date.now()}-ECE-005`,
        ruleId: 'ECE-005',
        severity: 'Recommendation',
        title: 'Pending Review',
        description: 'Draft KSP memerlukan reviu Kepala Sekolah',
        affectedModule: 'KSP',
        affectedSection: 'Persetujuan',
        recommendation: 'Minta Kepala Sekolah untuk mereviu draft KSP.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
