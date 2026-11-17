export type WorkspaceMode = 'preview' | 'edit' | 'printPreview' | 'developer';

export interface PresentationOverride {
  id: string;
  type: 'text' | 'multiline';
  value: string;
  metadata?: any;
}

export interface WorkspaceState {
  workspaceMode: WorkspaceMode;
  selection: string | null;
  overrides: Record<string, PresentationOverride>;
  zoom: number;
}
