import { ReportingView } from './ReportingView';
import { DomainEvent } from '../events/DomainEvent';

export class ReportingViewBuilder {
  private view: ReportingView;

  constructor(academicYear: string) {
    this.view = {
      viewId: `rpv-${Date.now()}`,
      viewName: 'ReportingView',
      schemaVersion: '1.0.0',
      generatedAt: Date.now(),
      lastUpdated: Date.now(),
      sourceVersion: '1.0',
      academicYear,
      printableSummary: '',
      executionSummary: { totalPlanned: 0, totalExecuted: 0 },
      approvalSummary: { pending: 0, approved: 0, rejected: 0 },
      evidenceSummary: { totalUploaded: 0, totalVerified: 0 }
    };
  }

  public applyEvent(event: DomainEvent): void {
    this.view.lastUpdated = Date.now();
    // Projection logic for Reporting
  }

  public getView(): ReportingView {
    return this.view;
  }
}
