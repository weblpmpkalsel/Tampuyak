import { BaseOperationalView } from './BaseOperationalView';

export interface DashboardView extends BaseOperationalView {
  academicYear: string;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  delayedActivities: number;
  cancelledActivities: number;
  overallProgress: number; // 0 to 100
  riskCount: number;
  issueCount: number;
  evidenceCount: number;
  approvalStatusSummary: Record<string, number>;
}
