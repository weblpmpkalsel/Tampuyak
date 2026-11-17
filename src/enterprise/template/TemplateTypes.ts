/**
 * Defines a section within a Template.
 */
export interface TemplateSection {
  chapterId: string;
  title: string;
  order: number;
  required: boolean;
  requiredDomains: string[]; // Domains that must be present
  optionalDomains: string[]; // Domains that can optionally be present
  dependencies?: string[]; // Other chapterIds this section depends on
}

/**
 * Defines the complete template for an enterprise document.
 */
export interface TemplateDefinition {
  templateId: string;
  templateName: string;
  version: string;
  sections: TemplateSection[];
}

/**
 * Details how a document is to be composed based on the Template Definition.
 */
export interface CompositionManifest {
  documentId: string;
  templateId: string;
  composedSections: ComposedSection[];
  missingRequiredDomains: string[];
}

/**
 * Represents a section within the Composition Manifest that has been resolved.
 */
export interface ComposedSection {
  chapterId: string;
  title: string;
  order: number;
  assignedDomains: string[];
}
