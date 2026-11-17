export interface RegisteredEvent {
  eventName: string;
  eventVersion: string;
  description: string;
  enabledFlag: boolean;
  metadata?: Record<string, any>;
}

export class EventRegistry {
  private static instance: EventRegistry;
  private registeredEvents: Map<string, RegisteredEvent> = new Map();

  private constructor() {}

  public static getInstance(): EventRegistry {
    if (!EventRegistry.instance) {
      EventRegistry.instance = new EventRegistry();
    }
    return EventRegistry.instance;
  }

  public registerEvent(event: RegisteredEvent): void {
    this.registeredEvents.set(event.eventName, event);
  }

  public getEvent(eventName: string): RegisteredEvent | undefined {
    return this.registeredEvents.get(eventName);
  }

  public getAllEvents(): RegisteredEvent[] {
    return Array.from(this.registeredEvents.values());
  }
}
