import { AdapterRegistry } from '../document/adapter/registry/AdapterRegistry';
import { KspAdapter } from '../document/adapter/ksp/KspAdapter';
import { PublishingRegistry } from '../publishing/registry/PublishingRegistry';
import { PdfPublisher } from '../publishing/plugins/pdf/PdfPublisher';
import { EnterpriseKnowledgeRegistry } from '../knowledge/registry/EnterpriseKnowledgeRegistry';
import { CURRICULUM_KNOWLEDGE_TYPES } from '../knowledge/registry/CurriculumKnowledgeRegistryEntries';

/**
 * Enterprise Plugin Bootstrapper
 * 
 * Enforces:
 * - Enterprise Rule 090: Registry Ownership. Plugins must never self-register.
 * 
 * This bootstrapper acts as the composition root, taking responsibility for
 * instantiating and registering all plugins into their respective registries.
 */
export class EnterprisePluginBootstrapper {
  public static bootstrap(): void {
    // Bootstrap Adapters
    AdapterRegistry.register('KSP', '1.0.0', new KspAdapter(), {
      supportsPrint: true,
      supportsPDF: true,
      supportsDOCX: true,
      supportsWorkspace: true,
      supportsAnnotations: true
    });

    // Bootstrap Publishers
    PublishingRegistry.register(new PdfPublisher());

    // Bootstrap Knowledge Types
    const knowledgeRegistry = EnterpriseKnowledgeRegistry.getInstance();
    for (const knowledgeType of CURRICULUM_KNOWLEDGE_TYPES) {
      if (!knowledgeRegistry.find(knowledgeType.id)) {
        knowledgeRegistry.register(knowledgeType);
      }
    }
  }
}
