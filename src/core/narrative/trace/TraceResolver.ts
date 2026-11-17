import { TraceGraph } from './TraceGraph';
import { TraceIndex } from './TraceIndex';
import { TraceReference } from './TraceTypes';

export class TraceResolver {
  private graph: TraceGraph;
  private index: TraceIndex;

  constructor(graph: TraceGraph, index: TraceIndex) {
    this.graph = graph;
    this.index = index;
  }

  public resolveNodeOrigin(nodeId: string): TraceReference[] {
    const node = this.graph.getNode(nodeId);
    return node ? [...node.references] : [];
  }

  public resolveSource(sourceType: string, sourceId: string): string[] {
    return this.index.getNodesBySource(sourceType, sourceId);
  }

  public resolveAncestors(nodeId: string): string[] {
    return this.graph.getAncestors(nodeId);
  }

  public resolveDescendants(nodeId: string): string[] {
    return this.graph.getDescendants(nodeId);
  }

  public resolveDependencies(nodeId: string): TraceReference[] {
    const ancestors = this.graph.getAncestors(nodeId);
    const dependencies: TraceReference[] = [];
    
    // Add current node's references
    const currentNode = this.graph.getNode(nodeId);
    if (currentNode) {
      dependencies.push(...currentNode.references);
    }

    // Add ancestors' references
    for (const ancestorId of ancestors) {
      const ancestorNode = this.graph.getNode(ancestorId);
      if (ancestorNode) {
        dependencies.push(...ancestorNode.references);
      }
    }

    // Deduplicate references based on traceId
    const uniqueMap = new Map<string, TraceReference>();
    for (const ref of dependencies) {
      if (!uniqueMap.has(ref.traceId)) {
        uniqueMap.set(ref.traceId, ref);
      }
    }

    return Array.from(uniqueMap.values());
  }
}
