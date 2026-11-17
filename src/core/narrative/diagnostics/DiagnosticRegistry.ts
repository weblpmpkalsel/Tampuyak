import { DiagnosticRule } from './DiagnosticRule';

export class DiagnosticRegistry {
  private rules: Map<string, DiagnosticRule> = new Map();

  register(rule: DiagnosticRule): void {
    this.rules.set(rule.id, rule);
  }

  get(id: string): DiagnosticRule | undefined {
    return this.rules.get(id);
  }

  getAll(): DiagnosticRule[] {
    return Array.from(this.rules.values());
  }

  clear(): void {
    this.rules.clear();
  }
}
