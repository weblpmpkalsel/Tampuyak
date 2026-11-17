import { TimelineView } from './TimelineView';
import { DashboardView } from './DashboardView';
import { MonitoringView } from './MonitoringView';
import { AnalyticsView } from './AnalyticsView';
import { ReportingView } from './ReportingView';
import { TimelineViewBuilder } from './TimelineViewBuilder';
import { DashboardViewBuilder } from './DashboardViewBuilder';
import { MonitoringViewBuilder } from './MonitoringViewBuilder';
import { AnalyticsViewBuilder } from './AnalyticsViewBuilder';
import { ReportingViewBuilder } from './ReportingViewBuilder';
import { EventHandler, EventHandlerResult } from '../events/EventHandler';
import { EventEnvelope } from '../events/EventEnvelope';

export class OperationalViewsEngine implements EventHandler {
  public handlerId = 'OperationalViewsEngine';
  public supportedEventTypes = [
    'ExecutionCreated', 'ExecutionUpdated', 'ExecutionStarted',
    'ExecutionCompleted', 'ExecutionVerified', 'ExecutionClosed',
    'EvidenceAdded', 'IssueCreated', 'RiskUpdated', 'ApprovalGranted'
  ];

  private timelineBuilder: TimelineViewBuilder;
  private dashboardBuilder: DashboardViewBuilder;
  private monitoringBuilder: MonitoringViewBuilder;
  private analyticsBuilder: AnalyticsViewBuilder;
  private reportingBuilder: ReportingViewBuilder;

  constructor(academicYear: string = 'DEFAULT') {
    this.timelineBuilder = new TimelineViewBuilder(academicYear);
    this.dashboardBuilder = new DashboardViewBuilder(academicYear);
    this.monitoringBuilder = new MonitoringViewBuilder(academicYear);
    this.analyticsBuilder = new AnalyticsViewBuilder(academicYear);
    this.reportingBuilder = new ReportingViewBuilder(academicYear);
  }

  public canHandle(envelope: EventEnvelope): boolean {
    return this.supportedEventTypes.includes(envelope.event.eventType);
  }

  public async handle(envelope: EventEnvelope): Promise<EventHandlerResult> {
    try {
      const event = envelope.event;
      this.timelineBuilder.applyEvent(event);
      this.dashboardBuilder.applyEvent(event);
      this.monitoringBuilder.applyEvent(event);
      this.analyticsBuilder.applyEvent(event);
      this.reportingBuilder.applyEvent(event);

      return { success: true, status: 'Processed', message: 'Views updated successfully' };
    } catch (error: any) {
      return { success: false, status: 'Failed', message: error.message, error };
    }
  }

  // Read API exposing provider-neutral methods
  public getTimelineView(): TimelineView {
    return this.timelineBuilder.getView();
  }

  public getDashboardView(): DashboardView {
    return this.dashboardBuilder.getView();
  }

  public getMonitoringView(): MonitoringView {
    return this.monitoringBuilder.getView();
  }

  public getAnalyticsView(): AnalyticsView {
    return this.analyticsBuilder.getView();
  }

  public getReportingView(): ReportingView {
    return this.reportingBuilder.getView();
  }
}
