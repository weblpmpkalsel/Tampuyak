import { ExecutionStatus } from '../models/ExecutionRecord';

export class ExecutionStateMachine {
  private static readonly transitions: Record<ExecutionStatus, ExecutionStatus[]> = {
    'Draft': ['Planned', 'Cancelled'],
    'Planned': ['Ready', 'Draft', 'Cancelled'],
    'Ready': ['InProgress', 'Planned', 'OnHold', 'Cancelled'],
    'InProgress': ['Completed', 'OnHold', 'Cancelled'],
    'OnHold': ['InProgress', 'Ready', 'Cancelled'],
    'Completed': ['Verified', 'InProgress', 'Closed'], // InProgress if rejected
    'Verified': ['Closed', 'InProgress'],
    'Closed': ['Archived'],
    'Cancelled': ['Archived'],
    'Archived': []
  };

  public static canTransition(current: ExecutionStatus, next: ExecutionStatus): boolean {
    if (current === next) return true;
    const allowed = this.transitions[current];
    return allowed ? allowed.includes(next) : false;
  }
}
