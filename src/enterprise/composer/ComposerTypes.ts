import { CanonicalKnowledgeObject } from '../knowledge/contracts/KnowledgeTypes';

/**
 * Represents a discrete section of a document, containing ordered knowledge objects.
 */
export interface DocumentSection {
  chapterId: string;
  title: string;
  order: number;
  knowledgeObjects: CanonicalKnowledgeObject<unknown>[];
}

/**
 * Represents the complete, assembled structural outline of a document.
 */
export interface DocumentStructure {
  documentId: string;
  title: string;
  sections: DocumentSection[];
}
