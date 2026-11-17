import { WorkspaceState } from '../state/WorkspaceStateTypes';
import { WorkspaceControllerMetadata } from './WorkspaceControllerTypes';
import { WorkspaceRkasModel } from '../workspace/WorkspaceTypes';
import { DocumentModel } from '../../DocumentCompositionEngine/DocumentModel';

export interface WorkspaceControllerResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  state?: WorkspaceState;
  rkasModel?: WorkspaceRkasModel; // Returned when GENERATE_RKAS is executed
  documentModel?: DocumentModel; // Expose the generated document model
  metadata?: WorkspaceControllerMetadata;
}
