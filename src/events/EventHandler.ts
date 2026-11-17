import { EventEnvelope } from './EventEnvelope';
import { EventLifecycle } from './EventTypes';

export interface EventHandlerResult {
  success: boolean;
  status: EventLifecycle;
  message?: string;
  error?: any;
}

export interface EventHandler {
  handlerId: string;
  
  /**
   * Defines which event types this handler supports
   */
  supportedEventTypes: string[];

  /**
   * Validate if the event can be processed by this handler
   */
  canHandle(envelope: EventEnvelope): boolean;

  /**
   * Process the event
   */
  handle(envelope: EventEnvelope): Promise<EventHandlerResult>;
}
