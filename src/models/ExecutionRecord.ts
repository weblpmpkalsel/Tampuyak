import { EvidenceReference } from './EvidenceReference';
import { RiskRecord } from './RiskRecord';
import { IssueRecord } from './IssueRecord';
import { ApprovalStatus } from './ApprovalRecord';

export type ExecutionStatus = 
  | 'Draft' 
  | 'Planned' 
  | 'Ready' 
  | 'InProgress' 
  | 'OnHold' 
  | 'Completed' 
  | 'Verified' 
  | 'Closed' 
  | 'Cancelled' 
  | 'Archived';

export interface ExecutionRecord {
  executionId: string;
  sourceActivityId: string;
  planningReferenceId: string; // E.g., Annual Planning Document ID
  executionStatus: ExecutionStatus;
  progressPercentage: number;
  
  executionStartDate?: number;
  executionEndDate?: number;
  
  responsiblePerson: string;
  responsibleTeam: string[];
  
  evidenceReferences: EvidenceReference[];
  riskRecords: RiskRecord[];
  issueRecords: IssueRecord[];
  
  recommendationNotes?: string;
  approvalStatus: ApprovalStatus;
  
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
  
  schemaVersion: string;
  metadata?: Record<string, any>;
}
