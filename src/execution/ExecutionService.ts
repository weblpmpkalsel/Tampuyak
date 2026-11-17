import { ExecutionRecord, ExecutionStatus } from '../models/ExecutionRecord';
import { ExecutionHistory } from './ExecutionHistory';
import { ExecutionStateMachine } from './ExecutionStateMachine';
import { ExecutionValidator } from './ExecutionValidator';

export class ExecutionService {
  private records: Map<string, ExecutionRecord> = new Map();
  private history: ExecutionHistory;

  constructor(historyTracker: ExecutionHistory) {
    this.history = historyTracker;
  }

  public createExecution(record: ExecutionRecord, createdBy: string): ExecutionRecord {
    const validation = ExecutionValidator.validate(record);
    if (!validation.isValid) {
      throw new Error(`Invalid ExecutionRecord: ${validation.errors.join(', ')}`);
    }

    this.records.set(record.executionId, record);
    this.history.logEvent(record.executionId, 'ExecutionCreated', record.executionStatus, createdBy, undefined, 'Execution initialized');
    
    return record;
  }

  public getExecution(executionId: string): ExecutionRecord | undefined {
    return this.records.get(executionId);
  }

  public updateStatus(executionId: string, newStatus: ExecutionStatus, updatedBy: string, notes?: string): ExecutionRecord {
    const record = this.records.get(executionId);
    if (!record) throw new Error('Execution not found');

    if (!ExecutionStateMachine.canTransition(record.executionStatus, newStatus)) {
      throw new Error(`Invalid state transition from ${record.executionStatus} to ${newStatus}`);
    }

    const prevStatus = record.executionStatus;
    record.executionStatus = newStatus;
    record.updatedAt = Date.now();
    record.updatedBy = updatedBy;

    this.history.logEvent(record.executionId, 'StatusChanged', newStatus, updatedBy, prevStatus, notes);

    return record;
  }
}
