export interface ReferenceProgram {
  id: string;
  code: string;
  name: string;
}

export interface ReferenceActivity {
  id: string;
  code: string;
  name: string;
}

export interface ReferenceComponent {
  id: string;
  name: string;
  category: string;
}

export interface ReferenceAccount {
  code: string;
  name: string;
  type: string;
}

export interface ReferenceFunding {
  source: string;
  description: string;
}

export interface ReferenceRequest {
  activityId: string;
  activityCode?: string;
  activityName: string;
  year: number;
  originalPayload?: any;
}

export interface ResolvedReference {
  program?: ReferenceProgram;
  activity?: ReferenceActivity;
  component?: ReferenceComponent;
  account?: ReferenceAccount;
  funding?: ReferenceFunding;
  originalRequest: ReferenceRequest;
  metadata?: any;
}
