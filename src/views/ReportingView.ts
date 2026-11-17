import { BaseOperationalView } from './BaseOperationalView';

export interface ReportingView extends BaseOperationalView {
  academicYear: string;
  printableSummary: string;
  executionSummary: {
    totalPlanned: number;
    totalExecuted: number;
  };
  approvalSummary: {
    pending: number;
    approved: number;
    rejected: number;
  };
  evidenceSummary: {
    totalUploaded: number;
    totalVerified: number;
  };
}
