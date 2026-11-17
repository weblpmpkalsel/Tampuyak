import { IASTNode, ASTNodeType } from './ASTTypes';

export class ASTSerializer {
  public toJSON(node: IASTNode, space: number = 0): string {
    return JSON.stringify(this.toObject(node), null, space);
  }

  public toCompactJSON(node: IASTNode): string {
    return JSON.stringify(this.toObject(node));
  }

  public toDebugJSON(node: IASTNode): string {
    const debugObj = this.toDebugObject(node);
    return JSON.stringify(debugObj, null, 2);
  }

  private toObject(node: IASTNode): any {
    const obj: any = {
      id: node.id,
      type: node.type,
      metadata: node.metadata,
      source: node.source,
      position: node.position,
      createdAt: node.createdAt,
      version: node.version,
    };
    
    if (node.parentId) {
      obj.parentId = node.parentId;
    }

    if (node.value !== undefined) {
      obj.value = node.value;
    }

    if (node.children && node.children.length > 0) {
      obj.children = node.children.map(c => this.toObject(c));
    }

    return obj;
  }

  private toDebugObject(node: IASTNode): any {
    return {
      t: node.type,
      v: node.value,
      c: node.children && node.children.length > 0 ? node.children.map(c => this.toDebugObject(c)) : undefined
    };
  }
}
