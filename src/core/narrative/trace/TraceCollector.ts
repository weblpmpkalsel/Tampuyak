import { TraceGraph } from './TraceGraph';
import { TraceIndex } from './TraceIndex';
import { TraceReference } from './TraceTypes';

export class TraceCollector {
  private graph: TraceGraph;
  private index: TraceIndex;

  constructor(graph: TraceGraph, index: TraceIndex) {
    this.graph = graph;
    this.index = index;
  }

  public collectNode(nodeId: string, references: TraceReference[]): void {
    this.graph.addNode(nodeId, references);
    this.index.indexNode(nodeId, references);
  }

  public linkHierarchy(parentId: string, childId: string): void {
    this.graph.addEdge(parentId, childId);
  }

  public collectFromAST(node: any, inheritReferences: TraceReference[] = []): void {
    if (!node || !node.id) return;

    const nodeReferences: TraceReference[] = [];
    
    // Add inherited references
    nodeReferences.push(...inheritReferences);

    // If node has its own source metadata, add it
    // Assuming ASTNodeSource structure matches roughly what we need
    if (node.source && node.source.origin) {
      // Very basic translation. In real implementation, you'd map ASTNodeSource to TraceReference more accurately
      const ref: TraceReference = {
        traceId: `trace-${node.id}-${Date.now()}`,
        sourceType: node.source.origin,
        sourceId: node.source.referenceId || node.id,
        timestamp: Date.now(),
        confidence: 1.0,
        generatedBy: 'ASTCollector'
      };
      nodeReferences.push(ref);
    }

    this.collectNode(node.id, nodeReferences);

    if (node.parentId) {
      this.linkHierarchy(node.parentId, node.id);
    }

    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        // Option to pass down references if needed
        this.collectFromAST(child, nodeReferences);
      }
    }
  }
}
