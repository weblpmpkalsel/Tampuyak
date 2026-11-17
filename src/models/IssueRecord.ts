export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';

export interface IssueRecord {
  issueId: string;
  category: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  resolution?: string;
  createdAt: number;
  resolvedAt?: number;
}
