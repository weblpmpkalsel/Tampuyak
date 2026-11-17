import { DiagnosticIssue } from './DiagnosticTypes';
import { DiagnosticRuleContext } from './DiagnosticRule';
import { DiagnosticRegistry } from './DiagnosticRegistry';
import { IASTNode } from '../ast/ASTTypes';

export class DiagnosticCollector {
  private registry: DiagnosticRegistry;

  constructor(registry: DiagnosticRegistry) {
    this.registry = registry;
  }

  public async collect(ast: IASTNode): Promise<DiagnosticIssue[]> {
    const context: DiagnosticRuleContext = { ast };
    const allIssues: DiagnosticIssue[] = [];
    const rules = this.registry.getAll();

    // In a real app this could be parallelized
    for (const rule of rules) {
      const issues = rule.evaluate(context);
      allIssues.push(...issues);
    }

    return allIssues;
  }
}
