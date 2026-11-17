import { TraceGraph } from './TraceGraph';
import { TraceNode } from './TraceTypes';

export class TraceSerializer {
  private graph: TraceGraph;

  constructor(graph: TraceGraph) {
    this.graph = graph;
  }

  public toJSON(): string {
    const data = this.graph.getAllNodes().map(node => this.serializeNode(node));
    return JSON.stringify(data, null, 2);
  }

  public toCompactJSON(): string {
    const data = this.graph.getAllNodes().map(node => this.serializeNode(node));
    return JSON.stringify(data);
  }

  public toDebugJSON(): string {
    const data = this.graph.getAllNodes().map(node => ({
      id: node.nodeId,
      refs: node.references.length,
      p: node.parentIds.length,
      c: node.childIds.length
    }));
    return JSON.stringify(data, null, 2);
  }

  public toAuditJSON(): string {
    const data = this.graph.getAllNodes().map(node => {
      return {
        nodeId: node.nodeId,
        sources: node.references.map(r => `${r.sourceType}:${r.sourceId} (${r.confidence * 100}%)`)
      };
    });
    return JSON.stringify(data, null, 2);
  }

  private serializeNode(node: TraceNode): any {
    return {
      nodeId: node.nodeId,
      references: node.references.map(ref => ({...ref})),
      parentIds: [...node.parentIds],
      childIds: [...node.childIds]
    };
  }
}
