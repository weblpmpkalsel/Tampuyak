import { NarrativeComposer } from './NarrativeComposer';
import { NarrativeFormatter } from './NarrativeFormatter';
import { NarrativeTemplateRegistry } from './NarrativeTemplateRegistry';
import { NarrativeVariableResolver } from './NarrativeVariableResolver';
import { NarrativeContextBuilder } from './NarrativeContextBuilder';
import { NarrativeContext, NarrativeResult } from './NarrativeTypes';

export class NarrativeEngine {
  private composer: NarrativeComposer;
  private formatter: NarrativeFormatter;
  private templateRegistry: NarrativeTemplateRegistry;

  constructor() {
    this.composer = new NarrativeComposer();
    this.formatter = new NarrativeFormatter();
    this.templateRegistry = new NarrativeTemplateRegistry();
  }

  getRegistry(): NarrativeTemplateRegistry {
    return this.templateRegistry;
  }

  build(context: NarrativeContext, templateIds: string[]): NarrativeResult {
    const sections: Record<string, string> = {};
    const warnings: string[] = [];
    let fullText = '';
    
    let wordCount = 0;
    let paragraphCount = 0;

    for (const templateId of templateIds) {
      const template = this.templateRegistry.get(templateId);
      if (!template) {
        warnings.push(`Template not found: ${templateId}`);
        continue;
      }

      const rawParagraphs = template.content.split(/\n\s*\n/);
      const composedParagraphs: string[] = [];

      for (const rawParagraph of rawParagraphs) {
        const sentences = rawParagraph.split(/(?<=[.!?])\s+/);
        const composedSentences = sentences.map(s => this.composer.composeSentence(s, context));
        const paragraph = this.composer.composeParagraph(composedSentences);
        
        if (paragraph) {
          composedParagraphs.push(paragraph);
        }
      }

      const sectionText = this.composer.composeSection(template.name, composedParagraphs);
      
      const validationWarnings = this.validateSection(sectionText);
      warnings.push(...validationWarnings);

      sections[templateId] = sectionText;
      fullText += sectionText + '\n\n';
      
      paragraphCount += composedParagraphs.length;
      wordCount += sectionText.split(/\s+/).filter(w => w.length > 0).length;
    }

    fullText = fullText.trim();

    return {
      text: fullText,
      sections,
      warnings,
      statistics: {
        wordCount,
        paragraphCount
      },
      qualityScore: this.calculateQualityScore(warnings, wordCount)
    };
  }

  compose(): void {
  }

  validate(): void {
  }

  format(): void {
  }

  export(): void {
  }

  private validateSection(text: string): string[] {
    const warnings: string[] = [];
    if (!text || text.trim() === '') {
      warnings.push('Empty section detected.');
    }
    if (text.includes('{{') || text.includes('}}')) {
      warnings.push('Unresolved placeholder detected.');
    }
    return warnings;
  }

  private calculateQualityScore(warnings: string[], wordCount: number): number {
    let score = 100;
    score -= warnings.length * 10;
    if (wordCount < 10) score -= 20;
    return Math.max(0, Math.min(100, score));
  }
}
