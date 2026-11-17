import { CanonicalDocument } from '../CanonicalDocumentTypes';

/**
 * Defines the structural and metadata wrapper for adapter output.
 * 
 * Enterprise Rule 051: Storage Safe
 * Output artifacts must be pure, serializable JSON data structures.
 */
export interface DocumentArtifactMetadata {
  readonly artifactId: string;
  readonly generatedAt: string;
  readonly sourceDocumentId: string;
  readonly artifactType: string;
}

/**
 * Output of an adapter. Never HTML, PDF, or DOCX.
 */
export interface DocumentArtifact<T> {
  readonly metadata: DocumentArtifactMetadata;
  readonly content: T;
}

/**
 * Base contract for all document-specific adapters.
 * 
 * Enterprise Rule 053 & 055: Document Agnostic
 * The foundation does not know about specific implementations like KSP or RKJM.
 */
export interface DocumentAdapter<T> {
  /**
   * Transforms a Canonical Document into a specific Document Artifact.
   * 
   * Enterprise Rule 052: Future Graph Ready
   * Implementations must map and preserve canonical node/block IDs.
   * 
   * Enterprise Rule 054: Structure Only
   * Adapters may transform document structure but must never modify knowledge content.
   * 
   * @param document The source CanonicalDocument.
   * @returns A serialized DocumentArtifact.
   */
  adapt(document: CanonicalDocument): DocumentArtifact<T>;
}
