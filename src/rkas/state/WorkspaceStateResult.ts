import { WorkspaceState } from './WorkspaceStateTypes';

export interface WorkspaceStateMetadata {
  timestamp: number;
  action: string;
}

export interface WorkspaceStateResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  state?: WorkspaceState;
  metadata?: WorkspaceStateMetadata;
}
