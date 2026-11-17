import { DocumentArtifact } from '../document/adapter/AdapterContracts';
import { DeepReadonly } from '../workspace/integration/WorkspaceArtifactConsumer';

/**
 * Enterprise Rule 081 & 088: Publishers shall declare capabilities and metadata.
 */
export interface PublisherMetadata {
  readonly publisherId: string;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly supportedMimeTypes: readonly string[];
  readonly capabilities: PublisherCapabilities;
}

/**
 * Enterprise Rule 081: Publishers shall declare capabilities.
 */
export interface PublisherCapabilities {
  readonly supportsPDF: boolean;
  readonly supportsDOCX: boolean;
  readonly supportsPrint: boolean;
  readonly supportsPreview: boolean;
  readonly supportsStreaming: boolean;
}

/**
 * The standard output of any Publisher.
 * Enterprise Rule 084: PublishingResult shall be immutable.
 */
export interface PublishingResult {
  readonly jobId: string;
  readonly artifactId: string;
  readonly format: string;
  readonly payloadUri: string;
  readonly generatedAt: string;
}

/**
 * Base contract for all Document Publishers.
 * 
 * Enterprise Rule 074: Publisher input only DocumentArtifact.
 * Enterprise Rule 088: Publisher Plugins shall expose metadata.
 */
export interface DocumentPublisher {
  readonly metadata: PublisherMetadata;
  
  /**
   * Transforms a DocumentArtifact into a finalized format.
   * 
   * Enterprise Rule 075 & 078: Publishers must never mutate DocumentArtifact.
   * 
   * @param artifact The strictly immutable DocumentArtifact.
   * @returns The standard PublishingResult.
   */
  publish(artifact: DeepReadonly<DocumentArtifact<any>>): DeepReadonly<PublishingResult>;
}
