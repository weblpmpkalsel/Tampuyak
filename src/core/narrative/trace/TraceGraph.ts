import { TraceNode, TraceReference } from './TraceTypes';

export class TraceGraph {
  private nodes: Map<string, TraceNode> = new Map();

  public addNode(nodeId: string, references: TraceReference[] = []): void {
    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, {
        nodeId,
        references: [...references],
        parentIds: [],
        childIds: []
      });
    } else {
      const existing = this.nodes.get(nodeId)!;
      existing.references.push(...references);
    }
  }

  public addEdge(parentId: string, childId: string): void {
    this.addNode(parentId);
    this.addNode(childId);

    const parentNode = this.nodes.get(parentId)!;
    const childNode = this.nodes.get(childId)!;

    if (!parentNode.childIds.includes(childId)) {
      parentNode.childIds.push(childId);
    }
    if (!childNode.parentIds.includes(parentId)) {
      childNode.parentIds.push(parentId);
    }
  }

  public getNode(nodeId: string): TraceNode | undefined {
    return this.nodes.get(nodeId);
  }

  public getAncestors(nodeId: string): string[] {
    const ancestors = new Set<string>();
    const stack = [nodeId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const node = this.nodes.get(currentId);
      if (node) {
        for (const parentId of node.parentIds) {
          if (!ancestors.has(parentId)) {
            ancestors.add(parentId);
            stack.push(parentId);
          }
        }
      }
    }
    return Array.from(ancestors);
  }

  public getDescendants(nodeId: string): string[] {
    const descendants = new Set<string>();
    const stack = [nodeId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const node = this.nodes.get(currentId);
      if (node) {
        for (const childId of node.childIds) {
          if (!descendants.has(childId)) {
            descendants.add(childId);
            stack.push(childId);
          }
        }
      }
    }
    return Array.from(descendants);
  }

  public getAllNodes(): TraceNode[] {
    return Array.from(this.nodes.values());
  }

  public clear(): void {
    this.nodes.clear();
  }
}
