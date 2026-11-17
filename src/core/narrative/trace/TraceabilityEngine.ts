import { TraceGraph } from './TraceGraph';
import { TraceIndex } from './TraceIndex';
import { TraceCollector } from './TraceCollector';
import { TraceResolver } from './TraceResolver';
import { TraceValidator } from './TraceValidator';
import { TraceSerializer } from './TraceSerializer';
import { TraceValidationResult } from './TraceTypes';

export class TraceabilityEngine {
  private _graph: TraceGraph;
  private _index: TraceIndex;
  private _collector: TraceCollector;
  private _resolver: TraceResolver;
  private _validator: TraceValidator;
  private _serializer: TraceSerializer;

  constructor() {
    this._graph = new TraceGraph();
    this._index = new TraceIndex(this._graph);
    this._collector = new TraceCollector(this._graph, this._index);
    this._resolver = new TraceResolver(this._graph, this._index);
    this._validator = new TraceValidator(this._graph);
    this._serializer = new TraceSerializer(this._graph);
  }

  public get collector(): TraceCollector {
    return this._collector;
  }

  public get resolver(): TraceResolver {
    return this._resolver;
  }

  public validate(): TraceValidationResult {
    return this._validator.validate();
  }

  public serialize(format: 'json' | 'compact' | 'debug' | 'audit' = 'json'): string {
    switch (format) {
      case 'compact': return this._serializer.toCompactJSON();
      case 'debug': return this._serializer.toDebugJSON();
      case 'audit': return this._serializer.toAuditJSON();
      case 'json':
      default:
        return this._serializer.toJSON();
    }
  }

  public clear(): void {
    this._graph.clear();
    this._index.reindexAll();
  }
}
