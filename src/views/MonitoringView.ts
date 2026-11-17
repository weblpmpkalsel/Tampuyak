import { BaseOperationalView } from './BaseOperationalView';

export interface MonitoringActivityDetail {
  activityId: string;
  status: string;
  progress: number;
  evidenceCount: number;
  openRisks: number;
  openIssues: number;
  recommendations: string[];
  followUp: string;
}

export interface MonitoringView extends BaseOperationalView {
  academicYear: string;
  monitoredActivities: MonitoringActivityDetail[];
}
