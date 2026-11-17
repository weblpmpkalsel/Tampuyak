export interface Regulation {
  id: string;
  name: string;
  description?: string;
}

export interface RegulatoryKnowledgePayload {
  regulations: readonly Regulation[];
}
