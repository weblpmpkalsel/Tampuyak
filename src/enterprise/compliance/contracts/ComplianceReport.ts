
import { ComplianceIssue } from './ComplianceIssue';

export interface ComplianceReport {
  timestamp: string;
  complianceScore: number;
  completionScore: number;
  releaseReadiness: boolean;
  issues: ComplianceIssue[];
}
