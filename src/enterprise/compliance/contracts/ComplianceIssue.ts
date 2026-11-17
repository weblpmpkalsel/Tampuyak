
export type Severity = 'Blocking' | 'Quality' | 'Recommendation' | 'Attachment Required';

export interface ComplianceIssue {
  issueId: string;
  ruleId: string;
  severity: Severity;
  title: string;
  description: string;
  affectedModule: string;
  affectedSection: string;
  recommendation: string;
  fixAction?: { type: 'DEEP_LINK' | 'AUTO_FIX'; target: string };
  resolved: boolean;
  timestamp: string;
}
