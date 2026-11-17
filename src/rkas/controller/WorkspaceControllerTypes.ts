import { WorkspaceState } from '../state/WorkspaceStateTypes';
import { WorkspaceStateMetadata } from '../state/WorkspaceStateResult';
import { RecommendationCandidate } from '../../recommendation/RecommendationTypes';
import { KnowledgeGraph } from '../../SPKG';

export type WorkspaceControllerAction = 
  | 'INITIALIZE'
  | 'LOAD_STATE'
  | 'SET_PLANNING_YEAR'
  | 'SELECT_ACTIVITY'
  | 'SELECT_RKAS'
  | 'GENERATE_RKAS';

export interface WorkspaceControllerContext {
  workspaceId: string;
  userId: string;
  role: string;
}

export interface WorkspaceControllerRequest {
  action: WorkspaceControllerAction;
  context: WorkspaceControllerContext;
  payload?: {
    year?: number;
    activityId?: string;
    rkasId?: string;
    activities?: any[];
    recommendations?: RecommendationCandidate[];
    existingIds?: string[];
    kg?: KnowledgeGraph;
    settings?: any;
  };
}

export interface WorkspaceControllerMetadata {
  timestamp: number;
  action: WorkspaceControllerAction;
  stateMetadata?: WorkspaceStateMetadata;
}
