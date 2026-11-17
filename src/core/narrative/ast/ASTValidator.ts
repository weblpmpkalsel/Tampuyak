import { IASTNode, ASTNodeType } from './ASTTypes';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ASTValidator {
  public validate(node: IASTNode): ValidationResult {
    const errors: string[] = [];
    const seenIds = new Set<string>();

    this.checkNode(node, null, seenIds, errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private checkNode(node: IASTNode, expectedParentId: string | null, seenIds: Set<string>, errors: string[]): void {
    if (!node) {
      errors.push('Encountered null or undefined node.');
      return;
    }

    if (!node.id) {
      errors.push(`Node of type ${node.type} is missing an id.`);
    } else {
      if (seenIds.has(node.id)) {
        errors.push(`Duplicate node ID found: ${node.id}`);
      }
      seenIds.add(node.id);
    }

    if (!Object.values(ASTNodeType).includes(node.type as ASTNodeType)) {
      errors.push(`Invalid node type: ${node.type}`);
    }

    if (expectedParentId !== null && node.parentId !== expectedParentId) {
      errors.push(`Broken hierarchy for node ${node.id}. Expected parent ${expectedParentId}, got ${node.parentId}`);
    }

    // specific node type validations
    if (node.type === ASTNodeType.TEXT && (node.value === undefined || node.value === null)) {
      errors.push(`TEXT node ${node.id} must have a value.`);
    }

    if (node.children) {
      for (const child of node.children) {
        this.checkNode(child, node.id, seenIds, errors);
      }
    }
  }
}
