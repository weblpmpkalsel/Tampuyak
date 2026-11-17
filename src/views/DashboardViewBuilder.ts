import { DashboardView } from './DashboardView';
import { DomainEvent } from '../events/DomainEvent';

export class DashboardViewBuilder {
  private view: DashboardView;

  constructor(academicYear: string) {
    this.view = {
      viewId: `dbv-${Date.now()}`,
      viewName: 'DashboardView',
      schemaVersion: '1.0.0',
      generatedAt: Date.now(),
      lastUpdated: Date.now(),
      sourceVersion: '1.0',
      academicYear,
      totalActivities: 0,
      completedActivities: 0,
      inProgressActivities: 0,
      delayedActivities: 0,
      cancelledActivities: 0,
      overallProgress: 0,
      riskCount: 0,
      issueCount: 0,
      evidenceCount: 0,
      approvalStatusSummary: {}
    };
  }

  public applyEvent(event: DomainEvent): void {
    this.view.lastUpdated = Date.now();
    // Projection logic for Dashboard
  }

  public getView(): DashboardView {
    return this.view;
  }
}
