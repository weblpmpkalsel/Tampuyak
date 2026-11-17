import { CanonicalKnowledgeObject } from '../knowledge/contracts/KnowledgeTypes';
import { CompositionManifest } from '../template/TemplateTypes';
import { DocumentSection, DocumentStructure } from './ComposerTypes';

/**
 * Pure function to map Knowledge Objects into Document Sections based on a Composition Manifest.
 * It does not mutate the inputs and performs no validation, formatting, or AI generation.
 * 
 * @param manifest The Composition Manifest describing the assembly.
 * @param title The title of the document.
 * @param knowledgeObjects The Knowledge Objects produced by Builders.
 * @returns A structured document containing ordered sections and their assigned knowledge objects.
 */
export function composeDocument(
  manifest: CompositionManifest,
  title: string,
  knowledgeObjects: CanonicalKnowledgeObject<unknown>[]
): DocumentStructure {
  const sections: DocumentSection[] = [];

  const sortedManifestSections = [...manifest.composedSections].sort((a, b) => a.order - b.order);

  for (const composedSection of sortedManifestSections) {
    const sectionKnowledge: CanonicalKnowledgeObject<unknown>[] = [];

    for (const domain of composedSection.assignedDomains) {
      const matchedObjects = knowledgeObjects.filter(ko => ko.metadata.domain === domain);
      sectionKnowledge.push(...matchedObjects);
    }

    sections.push({
      chapterId: composedSection.chapterId,
      title: composedSection.title,
      order: composedSection.order,
      knowledgeObjects: sectionKnowledge
    });
  }

  return {
    documentId: manifest.documentId,
    title,
    sections
  };
}
