export interface BaseOperationalView {
  viewId: string;
  viewName: string;
  schemaVersion: string;
  generatedAt: number;
  lastUpdated: number;
  sourceVersion: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}
