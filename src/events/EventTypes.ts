export type EventCategory = 
  | 'Execution'
  | 'Planning'
  | 'Monitoring'
  | 'Approval'
  | 'Evidence'
  | 'Risk'
  | 'Issue'
  | 'Budget'
  | 'Timeline'
  | 'Notification'
  | 'Analytics';

export type EventLifecycle = 
  | 'Created'
  | 'Published'
  | 'Received'
  | 'Processed'
  | 'Completed'
  | 'Failed'
  | 'Cancelled';

export type ExecutionEventType = 
  | 'ExecutionCreated'
  | 'ExecutionUpdated'
  | 'ExecutionStarted'
  | 'ExecutionPaused'
  | 'ExecutionResumed'
  | 'ExecutionCompleted'
  | 'ExecutionVerified'
  | 'ExecutionClosed'
  | 'ExecutionCancelled';

export type EvidenceEventType = 
  | 'EvidenceAdded'
  | 'EvidenceRemoved'
  | 'EvidenceVerified';

export type IssueEventType = 
  | 'IssueCreated'
  | 'IssueUpdated'
  | 'IssueResolved';

export type RiskEventType = 
  | 'RiskCreated'
  | 'RiskUpdated'
  | 'RiskMitigated';

export type ApprovalEventType = 
  | 'ApprovalRequested'
  | 'ApprovalGranted'
  | 'ApprovalRejected'
  | 'ApprovalRevisionRequested';

export type DomainEventType = 
  | ExecutionEventType
  | EvidenceEventType
  | IssueEventType
  | RiskEventType
  | ApprovalEventType
  | string; // Support for future event types

export interface EventPayload {
  entityId: string;
  entityType: string;
  currentStatus: string;
  previousStatus?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
