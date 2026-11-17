import { MonitoringView } from './MonitoringView';
import { DomainEvent } from '../events/DomainEvent';

export class MonitoringViewBuilder {
  private view: MonitoringView;

  constructor(academicYear: string) {
    this.view = {
      viewId: `mnv-${Date.now()}`,
      viewName: 'MonitoringView',
      schemaVersion: '1.0.0',
      generatedAt: Date.now(),
      lastUpdated: Date.now(),
      sourceVersion: '1.0',
      academicYear,
      monitoredActivities: []
    };
  }

  public applyEvent(event: DomainEvent): void {
    this.view.lastUpdated = Date.now();
    // Projection logic for Monitoring
  }

  public getView(): MonitoringView {
    return this.view;
  }
}
