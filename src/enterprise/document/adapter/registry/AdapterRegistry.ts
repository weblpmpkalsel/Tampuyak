import { DocumentAdapter } from '../AdapterContracts';

/**
 * Enterprise Rule 063: Every adapter must declare its capabilities.
 */
export interface AdapterCapabilities {
  readonly supportsPrint: boolean;
  readonly supportsPDF: boolean;
  readonly supportsDOCX: boolean;
  readonly supportsWorkspace: boolean;
  readonly supportsAnnotations: boolean;
}

/**
 * Represents a dynamically registered adapter plugin.
 */
export interface RegisteredAdapter<T> {
  readonly pluginId: string;
  readonly version: string;
  readonly adapter: DocumentAdapter<T>;
  readonly capabilities: AdapterCapabilities;
}

/**
 * Enterprise Rule 057: Register through Adapter Registry.
 * Do not instantiate adapters directly.
 * Enterprise Rule 066: Registry supports future versioned adapters.
 */
export class AdapterRegistry {
  private static registry = new Map<string, RegisteredAdapter<any>>();

  private static getRegistryKey(pluginId: string, version: string): string {
    return `${pluginId}@${version}`;
  }

  /**
   * Registers a DocumentAdapter along with its declared capabilities and version.
   */
  public static register<T>(pluginId: string, version: string, adapter: DocumentAdapter<T>, capabilities: AdapterCapabilities): void {
    const key = this.getRegistryKey(pluginId, version);
    this.registry.set(key, { pluginId, version, adapter, capabilities });
  }

  /**
   * Retrieves a registered DocumentAdapter by its ID and version.
   */
  public static getAdapter<T>(pluginId: string, version: string): RegisteredAdapter<T> {
    const key = this.getRegistryKey(pluginId, version);
    const entry = this.registry.get(key);
    if (!entry) {
      throw new Error(`Adapter plugin [${pluginId}] version [${version}] not found in registry.`);
    }
    return entry as RegisteredAdapter<T>;
  }
}
