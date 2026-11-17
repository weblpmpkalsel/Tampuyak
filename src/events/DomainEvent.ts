import { DomainEventType, EventPayload } from './EventTypes';

export interface DomainEvent<T extends EventPayload = EventPayload> {
  eventId: string;
  eventName: string;
  eventType: DomainEventType;
  aggregateId: string;
  aggregateType: string;
  occurredAt: number;
  triggeredBy: string;
  correlationId: string;
  schemaVersion: string;
  metadata?: Record<string, any>;
  payload: T;
}
