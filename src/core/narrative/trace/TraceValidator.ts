import { TraceGraph } from './TraceGraph';
import { TraceValidationResult } from './TraceTypes';

export class TraceValidator {
  private graph: TraceGraph;

  constructor(graph: TraceGraph) {
    this.graph = graph;
  }

  public validate(): TraceValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const nodes = this.graph.getAllNodes();

    if (nodes.length === 0) {
      warnings.push('Trace graph is empty.');
    }

    const seenTraceIds = new Set<string>();

    for (const node of nodes) {
      if (node.references.length === 0) {
        warnings.push(`Node ${node.nodeId} has no trace references (orphan node).`);
      }

      for (const ref of node.references) {
        if (!ref.traceId) {
          errors.push(`Node ${node.nodeId} contains a reference without a traceId.`);
        } else {
          if (seenTraceIds.has(ref.traceId)) {
            // Depending on design, duplicate traceIds might be an error or just shared references.
            // For now, we assume traceIds are unique per reference instantiation.
          }
          seenTraceIds.add(ref.traceId);
        }

        if (!ref.sourceType || !ref.sourceId) {
          errors.push(`Node ${node.nodeId} contains an invalid reference (missing sourceType or sourceId).`);
        }
      }

      // Check hierarchy consistency
      for (const parentId of node.parentIds) {
        const parent = this.graph.getNode(parentId);
        if (!parent) {
          errors.push(`Node ${node.nodeId} references a non-existent parent: ${parentId}`);
        } else if (!parent.childIds.includes(node.nodeId)) {
           errors.push(`Broken hierarchy: Node ${node.nodeId} claims parent ${parentId}, but parent does not list it as child.`);
        }
      }

      for (const childId of node.childIds) {
        const child = this.graph.getNode(childId);
        if (!child) {
          errors.push(`Node ${node.nodeId} references a non-existent child: ${childId}`);
        } else if (!child.parentIds.includes(node.nodeId)) {
          errors.push(`Broken hierarchy: Node ${node.nodeId} claims child ${childId}, but child does not list it as parent.`);
        }
      }
    }

    // Circular dependency check (simple DFS)
    if (this.detectCircularDependencies(nodes)) {
       errors.push('Circular reference detected in trace graph.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private detectCircularDependencies(nodes: any[]): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const checkCycle = (nodeId: string): boolean => {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recStack.add(nodeId);

        const node = this.graph.getNode(nodeId);
        if (node) {
          for (const childId of node.childIds) {
            if (!visited.has(childId) && checkCycle(childId)) {
              return true;
            } else if (recStack.has(childId)) {
              return true;
            }
          }
        }
      }
      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (checkCycle(node.nodeId)) {
        return true;
      }
    }

    return false;
  }
}
