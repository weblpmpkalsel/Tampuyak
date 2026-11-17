import { 
  WorkspaceControllerRequest
} from './WorkspaceControllerTypes';
import { WorkspaceControllerResult } from './WorkspaceControllerResult';
import { WorkspaceStateManager } from '../state/WorkspaceStateManager';
import { DocumentRouter } from '../../document/DocumentRouter';

export class WorkspaceController {
  private stateManager: WorkspaceStateManager;

  constructor() {
    this.stateManager = new WorkspaceStateManager();
  }

  /**
   * Application composition layer for RKAS Workspace.
   * Coordinates Workspace State and Workspace Adapter.
   * Does NOT implement business rules.
   */
  public execute(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    switch (request.action) {
      case 'INITIALIZE': return this.handleInitialize(request);
      case 'LOAD_STATE': return this.handleLoadState(request);
      case 'SET_PLANNING_YEAR': return this.handleSetPlanningYear(request);
      case 'SELECT_ACTIVITY': return this.handleSelectActivity(request);
      case 'SELECT_RKAS': return this.handleSelectRkas(request);
      case 'GENERATE_RKAS': return this.handleGenerateRkas(request);
      default: return this.createErrorResult(['Unknown action'], request.action);
    }
  }

  private handleInitialize(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    const { workspaceId, userId, role } = request.context;
    const result = this.stateManager.createInitialState(workspaceId, userId, role);
    return this.mapStateResult(result, 'INITIALIZE');
  }

  private handleLoadState(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    const result = this.stateManager.getCurrentState();
    return this.mapStateResult(result, 'LOAD_STATE');
  }

  private handleSetPlanningYear(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    const year = request.payload?.year ?? null;
    const result = this.stateManager.setActivePlanningYear(year);
    return this.mapStateResult(result, 'SET_PLANNING_YEAR');
  }

  private handleSelectActivity(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    const activityId = request.payload?.activityId ?? null;
    const result = this.stateManager.setSelectedActivity(activityId);
    return this.mapStateResult(result, 'SELECT_ACTIVITY');
  }

  private handleSelectRkas(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    const rkasId = request.payload?.rkasId ?? null;
    const result = this.stateManager.setSelectedRkas(rkasId);
    return this.mapStateResult(result, 'SELECT_RKAS');
  }

  private handleGenerateRkas(request: WorkspaceControllerRequest): WorkspaceControllerResult {
    // 1. Get current state to ensure workspace is ready
    const stateResult = this.stateManager.getCurrentState();
    if (!stateResult.success || !stateResult.state) {
      return this.createErrorResult(['Cannot generate RKAS: Workspace state is unavailable'], 'GENERATE_RKAS');
    }

    // 2. Update status to generating
    this.stateManager.updateStatus('GENERATING');

    const kg = request.payload?.kg;
    const settings = request.payload?.settings || {};
    
    let documentModel;
    let success = false;
    let errors: string[] = [];

    if (kg) {
      try {
        // 3. Request the RKAS document through the existing Router
        documentModel = DocumentRouter.generate('rkas', kg, settings);
        success = true;
      } catch (error: any) {
        success = false;
        errors = [error.message];
      }
    } else {
      success = false;
      errors = ['Missing Knowledge Graph for DocumentRouter.'];
    }

    // 4. Update status
    if (success) {
      this.stateManager.updateStatus('READY');
    } else {
      this.stateManager.updateStatus('ERROR');
    }

    // 5. Get final state
    const finalStateResult = this.stateManager.getCurrentState();

    return {
      success,
      errors,
      warnings: [],
      state: finalStateResult.state,
      documentModel,
      metadata: {
        timestamp: Date.now(),
        action: 'GENERATE_RKAS'
      }
    };
  }

  private mapStateResult(stateResult: any, action: any): WorkspaceControllerResult {
    return {
      success: stateResult.success,
      errors: stateResult.errors || [],
      warnings: stateResult.warnings || [],
      state: stateResult.state,
      metadata: {
        timestamp: Date.now(),
        action: action,
        stateMetadata: stateResult.metadata
      }
    };
  }

  private createErrorResult(errors: string[], action: any): WorkspaceControllerResult {
    return {
      success: false,
      errors,
      warnings: [],
      metadata: {
        timestamp: Date.now(),
        action
      }
    };
  }
}
