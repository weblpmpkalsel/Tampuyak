export interface KnowledgeScore {
  itemId: string;
  score: number;
  matches: string[];
  misses: string[];
  hardConstraintFailed: boolean;
}
