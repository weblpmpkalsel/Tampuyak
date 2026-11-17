import { ExecutionStatus } from './ExecutionRecord';

export type ExecutionEventType = 
  | 'ExecutionCreated' 
  | 'ExecutionUpdated' 
  | 'StatusChanged' 
  | 'EvidenceAdded' 
  | 'IssueCreated' 
  | 'RiskUpdated' 
  | 'ApprovalGranted' 
  | 'ExecutionClosed';

export interface ExecutionHistoryRecord {
  historyId: string;
  executionId: string;
  timestamp: number;
  eventType: ExecutionEventType;
  previousStatus?: ExecutionStatus;
  currentStatus: ExecutionStatus;
  changedBy: string;
  notes?: string;
  metadata?: Record<string, any>;
}
