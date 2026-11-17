import { DocumentArtifact } from '../document/adapter/AdapterContracts';
import { DeepReadonly } from '../workspace/integration/WorkspaceArtifactConsumer';
import { DocumentPublisher, PublishingResult } from './PublishingContracts';

/**
 * Enterprise Publishing Engine
 * 
 * Enterprise Rule 080: Publishing Engine shall be stateless.
 */
export class PublishingEngine {
  /**
   * Executes a DocumentPublisher statelessly.
   * 
   * Enterprise Rule 074: Publisher input only DocumentArtifact.
   * Enterprise Rule 075 & 078: Publishers must never mutate DocumentArtifact.
   * 
   * @param artifact The immutable DocumentArtifact.
   * @param publisher The format-specific publisher implementation.
   * @returns The standard PublishingResult.
   */
  public static execute(
    artifact: DeepReadonly<DocumentArtifact<any>>, 
    publisher: DocumentPublisher
  ): DeepReadonly<PublishingResult> {
    return publisher.publish(artifact);
  }
}
