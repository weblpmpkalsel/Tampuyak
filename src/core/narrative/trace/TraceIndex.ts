import { TraceGraph } from './TraceGraph';
import { TraceReference } from './TraceTypes';

export class TraceIndex {
  private sourceToNodeIndex: Map<string, Set<string>> = new Map();
  private nodeToSourceIndex: Map<string, Set<string>> = new Map();
  private graph: TraceGraph;

  constructor(graph: TraceGraph) {
    this.graph = graph;
  }

  public indexNode(nodeId: string, references: TraceReference[]): void {
    if (!this.nodeToSourceIndex.has(nodeId)) {
      this.nodeToSourceIndex.set(nodeId, new Set());
    }
    const nodeSources = this.nodeToSourceIndex.get(nodeId)!;

    for (const ref of references) {
      const sourceKey = this.buildSourceKey(ref);
      nodeSources.add(sourceKey);

      if (!this.sourceToNodeIndex.has(sourceKey)) {
        this.sourceToNodeIndex.set(sourceKey, new Set());
      }
      this.sourceToNodeIndex.get(sourceKey)!.add(nodeId);
    }
  }

  public getNodesBySource(sourceType: string, sourceId: string): string[] {
    const sourceKey = `${sourceType}::${sourceId}`;
    const nodeIds = this.sourceToNodeIndex.get(sourceKey);
    return nodeIds ? Array.from(nodeIds) : [];
  }

  public getSourcesByNode(nodeId: string): string[] {
    const sourceKeys = this.nodeToSourceIndex.get(nodeId);
    return sourceKeys ? Array.from(sourceKeys) : [];
  }

  private buildSourceKey(ref: TraceReference): string {
    return `${ref.sourceType}::${ref.sourceId}`;
  }

  public reindexAll(): void {
    this.sourceToNodeIndex.clear();
    this.nodeToSourceIndex.clear();

    const nodes = this.graph.getAllNodes();
    for (const node of nodes) {
      this.indexNode(node.nodeId, node.references);
    }
  }
}
