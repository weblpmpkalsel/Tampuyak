export enum DocumentStatus {
  DRAFT = 'DRAFT',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum DocumentSource {
  OFFICIAL_TEMPLATE = 'OFFICIAL_TEMPLATE',
  SCHOOL_TEMPLATE = 'SCHOOL_TEMPLATE',
  COMMUNITY_TEMPLATE = 'COMMUNITY_TEMPLATE',
  UPLOADED = 'UPLOADED',
  GENERATED = 'GENERATED',
  COPIED = 'COPIED',
}

export interface ReferencedBy {
  moduleId: string; // e.g., 'KSP', 'RKJM', 'RKT', 'RKAS', 'SPMI', etc.
  referenceContext?: string; // Additional context
}

export interface EnterpriseDocumentProps {
  id: string;
  title: string;
  category: string;
  knowledgeDomain: string;
  academicYear: string;
  owner: string;
  status: DocumentStatus;
  version: number;
  source: DocumentSource;
  description?: string;
  referencedBy: ReferencedBy[];
  createdAt: number;
  updatedAt: number;
  content?: Record<string, any>;
}
