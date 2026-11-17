import { DocumentArtifact } from '../../document/adapter/AdapterContracts';
import { AdapterRegistry, RegisteredAdapter } from '../../document/adapter/registry/AdapterRegistry';
import { CanonicalDocument } from '../../document/CanonicalDocumentTypes';

/**
 * Enterprise Workspace Artifact Consumer
 * 
 * Enforces:
 * - Enterprise Rule 064: Use Adapter Registry only.
 * - Enterprise Rule 065: DocumentArtifact is immutable (Deep Readonly type).
 * - Enterprise Rule 068: Workspace must never mutate DocumentArtifact. Presentation state is ephemeral.
 * - Enterprise Rule 069: Navigation must rely on stable IDs. Never array indices.
 * - Enterprise Rule 071: Capability discovery must come from Adapter capabilities.
 * - Enterprise Rule 072: Workspace shall remain document agnostic.
 */

// DeepReadonly to strictly enforce Rule 065 and 068 at compile time
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[] ? readonly DeepReadonly<U>[] :
                           T[P] extends ReadonlyArray<infer U> ? readonly DeepReadonly<U>[] :
                           T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export class WorkspaceArtifactConsumer {
  private currentArtifact: DeepReadonly<DocumentArtifact<any>> | null = null;
  private currentAdapterInfo: RegisteredAdapter<any> | null = null;
  
  // Navigation State (Rule 069: Stable IDs)
  private activeSectionId: string | null = null;
  private activeBlockId: string | null = null;

  /**
   * Loads a DocumentArtifact utilizing the Adapter Registry.
   * Enforces Rule 064 and Rule 072.
   */
  public loadArtifact(artifact: DocumentArtifact<any>, pluginId: string, version: string): void {
    // Rule 064: Use Adapter Registry only
    this.currentAdapterInfo = AdapterRegistry.getAdapter(pluginId, version);
    
    // Rule 065 & 068: Store as strictly immutable
    this.currentArtifact = artifact as DeepReadonly<DocumentArtifact<any>>;
    
    // Reset navigation state
    this.activeSectionId = null;
    this.activeBlockId = null;
  }

  /**
   * Gets the currently loaded immutable artifact.
   */
  public getArtifact(): DeepReadonly<DocumentArtifact<any>> {
    if (!this.currentArtifact) {
      throw new Error('No artifact loaded in Workspace.');
    }
    return this.currentArtifact;
  }

  /**
   * Rule 071: Capability discovery must come from Adapter capabilities.
   */
  public checkCapability(capability: keyof typeof this.currentAdapterInfo.capabilities): boolean {
    if (!this.currentAdapterInfo) {
      throw new Error('No adapter loaded.');
    }
    return this.currentAdapterInfo.capabilities[capability] === true;
  }

  /**
   * Rule 069: Navigation must rely on stable IDs. Never array indices.
   */
  public navigateToSection(sectionId: string): void {
    if (!this.currentArtifact) throw new Error('No artifact loaded.');
    // In a real app, this would verify the sectionId exists in the artifact structure.
    this.activeSectionId = sectionId;
    this.activeBlockId = null;
  }

  /**
   * Rule 069: Navigation must rely on stable IDs. Never array indices.
   */
  public navigateToBlock(blockId: string): void {
    if (!this.currentArtifact) throw new Error('No artifact loaded.');
    // In a real app, this would verify the blockId exists.
    this.activeBlockId = blockId;
  }

  public getActiveNavigationState() {
    return {
      sectionId: this.activeSectionId,
      blockId: this.activeBlockId
    };
  }

  /**
   * Rule 070: Provide Developer Inspector Mode.
   * Dumps the current artifact and capabilities for inspection.
   */
  public inspect(): string {
    if (!this.currentArtifact || !this.currentAdapterInfo) {
      return 'Inspector: No artifact loaded.';
    }
    return JSON.stringify({
      artifactMetadata: this.currentArtifact.metadata,
      adapter: {
        pluginId: this.currentAdapterInfo.pluginId,
        version: this.currentAdapterInfo.version,
        capabilities: this.currentAdapterInfo.capabilities
      },
      navigation: this.getActiveNavigationState()
    }, null, 2);
  }
}
