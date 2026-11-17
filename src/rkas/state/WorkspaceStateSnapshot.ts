import { WorkspaceState } from './WorkspaceStateTypes';

export class WorkspaceStateSnapshot {
  /**
   * Creates an immutable snapshot of the given workspace state.
   * Can be used to support future undo/redo functionality.
   * Does not perform any persistence or storage.
   */
  public static create(state: WorkspaceState): Readonly<WorkspaceState> {
    // Deep clone the state to ensure immutability of the snapshot
    const snapshot: WorkspaceState = JSON.parse(JSON.stringify(state));
    return Object.freeze(snapshot);
  }
}
