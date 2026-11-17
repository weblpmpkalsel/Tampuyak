import { NarrativeFormatter } from './NarrativeFormatter';
import { NarrativeVariableResolver } from './NarrativeVariableResolver';
import { NarrativeContext } from './NarrativeTypes';

export class NarrativeComposer {
  private formatter: NarrativeFormatter;
  private resolver: NarrativeVariableResolver;
  
  constructor() {
    this.formatter = new NarrativeFormatter();
    this.resolver = new NarrativeVariableResolver();
  }

  composeSentence(template: string, context: NarrativeContext): string {
    const resolved = this.resolver.resolve(template, context);
    return this.formatter.ensurePunctuation(this.formatter.capitalizeFirstLetter(this.formatter.cleanSpacing(resolved)));
  }

  composeParagraph(sentences: string[]): string {
    return sentences
      .filter(s => s && s.trim().length > 0)
      .map(s => this.formatter.cleanSpacing(s))
      .join(' ');
  }

  composeSection(title: string, paragraphs: string[]): string {
    const content = paragraphs.filter(p => p.trim().length > 0).join('\n\n');
    return `${title}\n\n${content}`;
  }
}
