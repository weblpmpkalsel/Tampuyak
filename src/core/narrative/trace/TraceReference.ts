import { TraceReference, TraceSourceType } from './TraceTypes';
import { generateTraceId } from './TraceUtilities';

export class TraceReferenceBuilder {
  private reference: Partial<TraceReference> = {
    timestamp: Date.now(),
    confidence: 1.0,
    generatedBy: 'NarrativeEngine'
  };

  withSource(type: TraceSourceType | string, id: string, path?: string): this {
    this.reference.sourceType = type;
    this.reference.sourceId = id;
    this.reference.sourcePath = path;
    return this;
  }

  withVersion(version: string): this {
    this.reference.sourceVersion = version;
    return this;
  }

  withSnapshot(snapshotId: string): this {
    this.reference.snapshotId = snapshotId;
    return this;
  }

  withOrigin(createdFrom: string): this {
    this.reference.createdFrom = createdFrom;
    return this;
  }

  withGenerator(generator: string): this {
    this.reference.generatedBy = generator;
    return this;
  }

  withConfidence(confidence: number): this {
    this.reference.confidence = confidence;
    return this;
  }

  build(): TraceReference {
    if (!this.reference.sourceType || !this.reference.sourceId) {
      throw new Error('TraceReference requires sourceType and sourceId');
    }

    return {
      traceId: generateTraceId(),
      sourceType: this.reference.sourceType,
      sourceId: this.reference.sourceId,
      sourcePath: this.reference.sourcePath,
      sourceVersion: this.reference.sourceVersion,
      snapshotId: this.reference.snapshotId,
      createdFrom: this.reference.createdFrom,
      generatedBy: this.reference.generatedBy,
      timestamp: this.reference.timestamp || Date.now(),
      confidence: this.reference.confidence ?? 1.0
    };
  }
}
