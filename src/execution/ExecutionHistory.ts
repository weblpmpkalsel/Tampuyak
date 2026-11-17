import { ExecutionHistoryRecord, ExecutionEventType } from '../models/ExecutionHistoryRecord';
import { ExecutionStatus } from '../models/ExecutionRecord';

export class ExecutionHistory {
  private historyLogs: Map<string, ExecutionHistoryRecord[]> = new Map();

  public logEvent(
    executionId: string, 
    eventType: ExecutionEventType, 
    currentStatus: ExecutionStatus, 
    changedBy: string, 
    previousStatus?: ExecutionStatus, 
    notes?: string
  ): ExecutionHistoryRecord {
    const record: ExecutionHistoryRecord = {
      historyId: `hist-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
      executionId,
      timestamp: Date.now(),
      eventType,
      currentStatus,
      previousStatus,
      changedBy,
      notes
    };
    
    if (!this.historyLogs.has(executionId)) {
      this.historyLogs.set(executionId, []);
    }
    this.historyLogs.get(executionId)!.push(record);
    
    return record;
  }
  
  public getHistory(executionId: string): ExecutionHistoryRecord[] {
    return this.historyLogs.get(executionId) || [];
  }
}
