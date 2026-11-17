import { WorkspaceState } from './WorkspaceTypes';
import { WorkspaceResult } from './WorkspaceResult';
import { WorkspaceMapper } from './WorkspaceMapper';
import { RkasGenerationService } from '../service/RkasGenerationService';

export class WorkspaceAdapter {
  /**
   * Adapts the workspace state into a generation request, 
   * invokes the enterprise service, and adapts the result back.
   * No business rules or validation are performed here.
   */
  public static generate(state: WorkspaceState): WorkspaceResult {
    try {
      // 1. Map Workspace State -> Enterprise Request
      const request = WorkspaceMapper.toGenerationRequest(state);

      // 2. Invoke Enterprise RKAS Integration Service
      const response = RkasGenerationService.generate(request);

      // 3. Handle Failure
      if (!response.success || !response.result) {
        return {
          success: false,
          errors: response.errors || ['Unknown error occurred during RKAS generation.'],
          warnings: response.warnings || [],
          data: undefined
        };
      }

      // 4. Map Enterprise Result -> Workspace Format
      const workspaceModel = WorkspaceMapper.toWorkspaceModel(response.result);
      
      // Map metadata if present
      if (response.metadata) {
        workspaceModel.metadata = response.metadata;
      }

      return {
        success: true,
        errors: response.errors || [],
        warnings: response.warnings || [],
        data: workspaceModel
      };
    } catch (error: any) {
      return {
        success: false,
        errors: [`Adapter encountered a failure: ${error.message}`],
        warnings: [],
        data: undefined
      };
    }
  }
}
