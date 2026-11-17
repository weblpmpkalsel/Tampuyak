import { ExecutionService } from './ExecutionService';
import { ExecutionHistory } from './ExecutionHistory';
import { ExecutionSummary, ExecutionSummaryResult } from './ExecutionSummary';
import { ExecutionRecord, ExecutionStatus } from '../models/ExecutionRecord';

/**
 * ExecutionEngine
 * The operational execution layer between planning and reporting.
 * Exposes a provider-neutral read model for other modules and controls write operations.
 */
export class ExecutionEngine {
  private static instance: ExecutionEngine;
  
  private historyTracker: ExecutionHistory;
  private executionService: ExecutionService;

  private constructor() {
    this.historyTracker = new ExecutionHistory();
    this.executionService = new ExecutionService(this.historyTracker);
  }

  public static getInstance(): ExecutionEngine {
    if (!ExecutionEngine.instance) {
      ExecutionEngine.instance = new ExecutionEngine();
    }
    return ExecutionEngine.instance;
  }

  // --- WRITE MODEL ---
  
  public startExecution(record: ExecutionRecord, initiatedBy: string): ExecutionRecord {
    return this.executionService.createExecution(record, initiatedBy);
  }

  public transitionStatus(executionId: string, newStatus: ExecutionStatus, requestedBy: string, reason?: string): ExecutionRecord {
    return this.executionService.updateStatus(executionId, newStatus, requestedBy, reason);
  }

  // --- READ MODEL ---

  public getExecutionState(executionId: string): ExecutionRecord | undefined {
    return this.executionService.getExecution(executionId);
  }

  public getExecutionSummary(executionId: string): ExecutionSummaryResult {
    const record = this.executionService.getExecution(executionId);
    if (!record) throw new Error('Execution not found');
    return ExecutionSummary.generate(record);
  }

  public getExecutionAuditTrail(executionId: string) {
    return this.historyTracker.getHistory(executionId);
  }
}
