import { GenerateRkasRequest } from '../service/RkasServiceTypes';
import { WorkspaceState, WorkspaceRkasModel } from './WorkspaceTypes';
import { RkasModel } from '../generator/RkasGeneratorTypes';

export class WorkspaceMapper {
  public static toGenerationRequest(state: WorkspaceState): GenerateRkasRequest {
    return {
      planningActivities: state.activities,
      year: state.targetYear,
      recommendationCandidates: state.recommendations,
      existingActivities: state.existingIds,
      context: state.context,
      options: state.options
    };
  }

  public static toWorkspaceModel(model: RkasModel): WorkspaceRkasModel {
    return {
      // Assuming RkasModel has an id and activities. Using fallbacks to prevent runtime errors.
      id: (model as any).id || `workspace-rkas-${Date.now()}`,
      year: model.year,
      items: (model as any).activities || [],
      rawModel: model
    };
  }
}
