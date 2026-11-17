import { ExecutionRecord } from '../models/ExecutionRecord';
import { ExecutionValidationResult, ExecutionValidator } from './ExecutionValidator';

export interface ExecutionSummaryResult {
  executionId: string;
  progress: number;
  evidenceCount: number;
  openIssues: number;
  openRisks: number;
  completionStatus: string;
  validationStatus: ExecutionValidationResult;
  lastUpdated: number;
}

export class ExecutionSummary {
  public static generate(record: ExecutionRecord): ExecutionSummaryResult {
    const openIssues = record.issueRecords.filter(i => i.status === 'Open' || i.status === 'InProgress').length;
    const openRisks = record.riskRecords.filter(r => r.status === 'Identified' || r.status === 'Mitigating').length;
    
    return {
      executionId: record.executionId,
      progress: record.progressPercentage,
      evidenceCount: record.evidenceReferences.length,
      openIssues,
      openRisks,
      completionStatus: record.executionStatus,
      validationStatus: ExecutionValidator.validate(record),
      lastUpdated: record.updatedAt
    };
  }
}
