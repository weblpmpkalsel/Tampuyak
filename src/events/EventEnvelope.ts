import { DomainEvent } from './DomainEvent';

export interface EventEnvelope<T extends import('./EventTypes').EventPayload = import('./EventTypes').EventPayload> {
  correlationId: string;
  traceId: string;
  eventVersion: string;
  publishedAt: number;
  payloadSize: number;
  metadata?: Record<string, any>;
  event: DomainEvent<T>;
}
