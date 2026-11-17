
import { ComplianceIssue, Severity } from './ComplianceIssue';

export interface ComplianceContext {
  documentType: 'KSP' | 'RKJM' | 'RKT' | 'RKAS';
  metadata: any; 
}

export interface ComplianceRule {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  appliesTo: string;
  recommendation: string;
  validate: (context: ComplianceContext) => ComplianceIssue | null;
}
