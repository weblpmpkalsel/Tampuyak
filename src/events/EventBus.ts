import { EventEnvelope } from './EventEnvelope';
import { EventHandler } from './EventHandler';
import { EventRegistry } from './EventRegistry';

export interface PublishResult {
  publishedAt: number;
  correlationId: string;
  traceId: string;
  dispatchedToHandlers: number;
  status: 'Published' | 'Failed';
  error?: string;
}

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]> = new Map();
  private registry: EventRegistry;

  private constructor() {
    this.registry = EventRegistry.getInstance();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public registerHandler(handler: EventHandler): void {
    for (const eventType of handler.supportedEventTypes) {
      if (!this.handlers.has(eventType)) {
        this.handlers.set(eventType, []);
      }
      const eventHandlers = this.handlers.get(eventType)!;
      // Avoid duplicate registrations
      if (!eventHandlers.find(h => h.handlerId === handler.handlerId)) {
        eventHandlers.push(handler);
      }
    }
  }

  public removeHandler(handlerId: string): void {
    for (const [eventType, eventHandlers] of this.handlers.entries()) {
      const filtered = eventHandlers.filter(h => h.handlerId !== handlerId);
      this.handlers.set(eventType, filtered);
    }
  }

  public async publish(envelope: EventEnvelope): Promise<PublishResult> {
    try {
      const eventType = envelope.event.eventType;
      
      // We could validate against registry here if strict enforcement is desired
      // const registeredEvent = this.registry.getEvent(eventType);

      const typeHandlers = this.handlers.get(eventType) || [];
      const dispatchPromises = typeHandlers
        .filter(handler => handler.canHandle(envelope))
        .map(handler => this.dispatchEvent(handler, envelope));

      // Fire and forget (or await all, depending on exact in-process concurrency semantics desired)
      // For a loose decoupled in-process bus, we may just log errors internally
      await Promise.allSettled(dispatchPromises);

      return {
        publishedAt: Date.now(),
        correlationId: envelope.correlationId,
        traceId: envelope.traceId,
        dispatchedToHandlers: dispatchPromises.length,
        status: 'Published'
      };
    } catch (error: any) {
      return {
        publishedAt: Date.now(),
        correlationId: envelope.correlationId,
        traceId: envelope.traceId,
        dispatchedToHandlers: 0,
        status: 'Failed',
        error: error?.message || 'Unknown error publishing event'
      };
    }
  }

  private async dispatchEvent(handler: EventHandler, envelope: EventEnvelope): Promise<void> {
    try {
      const result = await handler.handle(envelope);
      // In a real implementation, we would store an audit log of the processed event
      // noting the handlerId, correlationId, traceId, and the result status.
    } catch (error) {
      // Error strategy: store metadata, no dead-letter queue, no retry for now
      // console.error(\`Handler \${handler.handlerId} failed for event \${envelope.event.eventId}\`, error);
    }
  }
}
