import { TimelineView } from './TimelineView';
import { DomainEvent } from '../events/DomainEvent';

export class TimelineViewBuilder {
  private view: TimelineView;

  constructor(academicYear: string) {
    this.view = {
      viewId: `tlv-${Date.now()}`,
      viewName: 'TimelineView',
      schemaVersion: '1.0.0',
      generatedAt: Date.now(),
      lastUpdated: Date.now(),
      sourceVersion: '1.0',
      academicYear,
      activities: []
    };
  }

  public applyEvent(event: DomainEvent): void {
    this.view.lastUpdated = Date.now();
    // Projection logic for Timeline
  }

  public getView(): TimelineView {
    return this.view;
  }
}
