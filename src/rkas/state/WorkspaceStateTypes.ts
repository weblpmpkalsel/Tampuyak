export type WorkspaceStatus = 'INITIALIZING' | 'READY' | 'GENERATING' | 'REVIEWING' | 'ERROR';

export type WorkspaceView = 'OVERVIEW' | 'PLANNING' | 'GENERATION' | 'REVIEW' | 'REPORTS';

export interface WorkspaceNotification {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: number;
}

export interface WorkspaceSelection {
  activePlanningYear: number | null;
  selectedActivityId: string | null;
  selectedRkasId: string | null;
}

export interface WorkspaceState {
  workspaceId: string;
  status: WorkspaceStatus;
  currentView: WorkspaceView;
  selection: WorkspaceSelection;
  notifications: WorkspaceNotification[];
  metadata: {
    lastUpdated: number;
    userId: string;
    role: string;
  };
}
