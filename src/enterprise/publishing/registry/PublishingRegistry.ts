import { DocumentPublisher, PublisherCapabilities, PublisherMetadata } from '../PublishingContracts';

/**
 * Represents a dynamically registered publisher plugin.
 */
export interface RegisteredPublisher {
  readonly pluginId: string;
  readonly version: string;
  readonly publisher: DocumentPublisher;
  readonly metadata: PublisherMetadata;
}

/**
 * Enterprise Rule 073: Publisher Registry.
 * Enterprise Rule 079: Publishing Registry shall support publisher versioning.
 * Enterprise Rule 089: PublishingRegistry shall validate plugin capabilities before registration.
 */
export class PublishingRegistry {
  private static registry = new Map<string, RegisteredPublisher>();

  private static getRegistryKey(pluginId: string, version: string): string {
    return `${pluginId}@${version}`;
  }

  /**
   * Registers a DocumentPublisher.
   * 
   * Enterprise Rule 077: Publisher capability declaration.
   * Enterprise Rule 089: Validates plugin capabilities.
   */
  public static register(publisher: DocumentPublisher): void {
    const { publisherId, version, capabilities } = publisher.metadata;

    // Rule 089: Validate plugin capabilities before registration
    if (!capabilities) {
      throw new Error(`Publisher [${publisherId}] must declare capabilities.`);
    }

    const key = this.getRegistryKey(publisherId, version);
    this.registry.set(key, { 
      pluginId: publisherId, 
      version, 
      publisher, 
      metadata: publisher.metadata 
    });
  }

  /**
   * Retrieves a registered DocumentPublisher by its ID and version.
   */
  public static getPublisher(pluginId: string, version: string): RegisteredPublisher {
    const key = this.getRegistryKey(pluginId, version);
    const entry = this.registry.get(key);
    if (!entry) {
      throw new Error(`Publisher plugin [${pluginId}] version [${version}] not found in registry.`);
    }
    return entry;
  }
}
