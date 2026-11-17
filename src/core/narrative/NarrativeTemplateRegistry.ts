import { NarrativeTemplate } from './NarrativeTypes';

export class NarrativeTemplateRegistry {
  private templates: Map<string, NarrativeTemplate> = new Map();

  register(template: NarrativeTemplate): void {
    this.templates.set(template.id, template);
  }

  get(id: string): NarrativeTemplate | undefined {
    return this.templates.get(id);
  }

  getAll(): NarrativeTemplate[] {
    return Array.from(this.templates.values());
  }

  has(id: string): boolean {
    return this.templates.has(id);
  }
}
