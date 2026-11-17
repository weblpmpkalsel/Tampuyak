import { WorkspaceRkasModel } from './WorkspaceTypes';

export interface WorkspaceResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  data?: WorkspaceRkasModel;
}
