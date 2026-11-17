import { TemplateDefinition, CompositionManifest, ComposedSection } from './TemplateTypes';

/**
 * Evaluates available Knowledge Domains against a Template Definition 
 * to produce a Composition Manifest.
 * 
 * Performs pure orchestration: no rendering, no publishing, no validation (beyond domain matching).
 * 
 * @param documentId The ID for the resulting composed document.
 * @param template The Template Definition to evaluate against.
 * @param availableDomains A list of Knowledge Domain identifiers currently available.
 * @returns A Composition Manifest describing the assembly.
 */
export function buildCompositionManifest(
  documentId: string,
  template: TemplateDefinition,
  availableDomains: string[]
): CompositionManifest {
  const domainSet = new Set(availableDomains);
  const missingRequiredDomains = new Set<string>();
  const composedSections: ComposedSection[] = [];

  const sortedSections = [...template.sections].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    const assignedDomains: string[] = [];

    // Process required domains
    for (const reqDomain of section.requiredDomains) {
      if (domainSet.has(reqDomain)) {
        assignedDomains.push(reqDomain);
      } else if (section.required) {
        missingRequiredDomains.add(reqDomain);
      }
    }

    // Process optional domains
    for (const optDomain of section.optionalDomains) {
      if (domainSet.has(optDomain)) {
        assignedDomains.push(optDomain);
      }
    }

    composedSections.push({
      chapterId: section.chapterId,
      title: section.title,
      order: section.order,
      assignedDomains
    });
  }

  return {
    documentId,
    templateId: template.templateId,
    composedSections,
    missingRequiredDomains: Array.from(missingRequiredDomains)
  };
}
