import { 
  WorkspaceState, 
  WorkspaceStatus, 
  WorkspaceView,
  WorkspaceSelection,
  WorkspaceNotification
} from './WorkspaceStateTypes';
import { WorkspaceStateResult } from './WorkspaceStateResult';

export class WorkspaceStateManager {
  private currentState: WorkspaceState | null = null;

  public createInitialState(workspaceId: string, userId: string, role: string): WorkspaceStateResult {
    try {
      this.currentState = {
        workspaceId,
        status: 'READY',
        currentView: 'OVERVIEW',
        selection: {
          activePlanningYear: null,
          selectedActivityId: null,
          selectedRkasId: null
        },
        notifications: [],
        metadata: {
          lastUpdated: Date.now(),
          userId,
          role
        }
      };

      return this.createSuccessResult(this.currentState, 'INITIALIZED');
    } catch (e: any) {
      return this.createErrorResult(['Failed to create initial state: ' + e.message]);
    }
  }

  public updateStatus(status: WorkspaceStatus): WorkspaceStateResult {
    if (!this.currentState) return this.createErrorResult(['Workspace not initialized']);
    
    this.currentState = {
      ...this.currentState,
      status,
      metadata: { ...this.currentState.metadata, lastUpdated: Date.now() }
    };
    
    return this.createSuccessResult(this.currentState, 'STATUS_UPDATED');
  }

  public setActivePlanningYear(year: number | null): WorkspaceStateResult {
    if (!this.currentState) return this.createErrorResult(['Workspace not initialized']);
    
    this.currentState = {
      ...this.currentState,
      selection: {
        ...this.currentState.selection,
        activePlanningYear: year
      },
      metadata: { ...this.currentState.metadata, lastUpdated: Date.now() }
    };
    
    return this.createSuccessResult(this.currentState, 'PLANNING_YEAR_UPDATED');
  }

  public setSelectedActivity(activityId: string | null): WorkspaceStateResult {
    if (!this.currentState) return this.createErrorResult(['Workspace not initialized']);
    
    this.currentState = {
      ...this.currentState,
      selection: {
        ...this.currentState.selection,
        selectedActivityId: activityId
      },
      metadata: { ...this.currentState.metadata, lastUpdated: Date.now() }
    };
    
    return this.createSuccessResult(this.currentState, 'ACTIVITY_SELECTED');
  }

  public setSelectedRkas(rkasId: string | null): WorkspaceStateResult {
    if (!this.currentState) return this.createErrorResult(['Workspace not initialized']);
    
    this.currentState = {
      ...this.currentState,
      selection: {
        ...this.currentState.selection,
        selectedRkasId: rkasId
      },
      metadata: { ...this.currentState.metadata, lastUpdated: Date.now() }
    };
    
    return this.createSuccessResult(this.currentState, 'RKAS_SELECTED');
  }

  public getCurrentState(): WorkspaceStateResult {
    if (!this.currentState) return this.createErrorResult(['Workspace not initialized']);
    return this.createSuccessResult(this.currentState, 'STATE_RETRIEVED');
  }

  private createSuccessResult(state: WorkspaceState, action: string): WorkspaceStateResult {
    return {
      success: true,
      errors: [],
      warnings: [],
      state: { ...state }, // Return a shallow copy
      metadata: {
        timestamp: Date.now(),
        action
      }
    };
  }

  private createErrorResult(errors: string[]): WorkspaceStateResult {
    return {
      success: false,
      errors,
      warnings: [],
      metadata: {
        timestamp: Date.now(),
        action: 'ERROR'
      }
    };
  }
}
