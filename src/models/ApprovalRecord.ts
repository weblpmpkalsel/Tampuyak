export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'NeedRevision';

export interface ApprovalRecord {
  approvalId: string;
  executionId: string;
  approvalStatus: ApprovalStatus;
  reviewer: string;
  approvedBy?: string;
  approvedAt?: number;
  notes?: string;
}
