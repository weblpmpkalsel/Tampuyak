import { DiagnosticIssue } from './DiagnosticTypes';
import { IASTNode } from '../ast/ASTTypes';

export interface DiagnosticRuleContext {
  ast: IASTNode;
  // traceGraph could go here
}

export interface DiagnosticRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  
  evaluate(context: DiagnosticRuleContext): DiagnosticIssue[];
}
