import { DocumentArtifact } from '../../document/adapter/AdapterContracts';
import { DeepReadonly } from '../../workspace/integration/WorkspaceArtifactConsumer';
import { PublishingEngine } from '../PublishingEngine';
import { PublishingResult } from '../PublishingContracts';
import { PublishingRegistry, RegisteredPublisher } from '../registry/PublishingRegistry';

/**
 * Publishing Service
 * 
 * Enterprise Rule 083: Workspace communicates only through Publishing Service.
 * Enterprise Rule 085: Publisher Plugins shall never know Workspace.
 * Enterprise Rule 087: PublishingService shall resolve publishers through the Registry.
 */
export class PublishingService {
  /**
   * Dispatches a publishing job to a registered publisher.
   * 
   * @param pluginId The ID of the publisher plugin (e.g., 'PDF_PUBLISHER').
   * @param version The version of the publisher plugin.
   * @param artifact The immutable DocumentArtifact to publish.
   * @returns The immutable PublishingResult.
   */
  public static publishArtifact(
    pluginId: string,
    version: string,
    artifact: DeepReadonly<DocumentArtifact<any>>
  ): DeepReadonly<PublishingResult> {
    // Rule 087: Resolve publisher through the Registry
    const registeredPublisher: RegisteredPublisher = PublishingRegistry.getPublisher(pluginId, version);

    // Rule 083: Workspace uses this service; the Service executes via the Engine.
    return PublishingEngine.execute(artifact, registeredPublisher.publisher);
  }

  /**
   * Retrieves the capabilities and metadata of a registered publisher without executing it.
   */
  public static getPublisherInfo(pluginId: string, version: string) {
    const entry = PublishingRegistry.getPublisher(pluginId, version);
    return entry.metadata;
  }
}
