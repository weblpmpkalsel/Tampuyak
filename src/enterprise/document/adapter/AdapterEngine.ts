import { CanonicalDocument } from '../CanonicalDocumentTypes';
import { DocumentAdapter, DocumentArtifact } from './AdapterContracts';

/**
 * Enterprise Adapter Engine
 * 
 * Enterprise Rule 056: Enterprise Adapter Engine shall be stateless.
 * It coordinates the execution of an adapter against a Canonical Document.
 */
export class AdapterEngine {
  /**
   * Executes a DocumentAdapter statelessly.
   * 
   * @param document The canonical document input.
   * @param adapter The document-agnostic adapter implementation.
   * @returns The generated DocumentArtifact.
   */
  public static execute<T>(document: CanonicalDocument, adapter: DocumentAdapter<T>): DocumentArtifact<T> {
    return adapter.adapt(document);
  }
}
