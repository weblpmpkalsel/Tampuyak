import { BaseOperationalView } from './BaseOperationalView';

export interface TimelineActivityNode {
  activityId: string;
  title: string;
  month: number[];
  quarter: number[];
  semester: number;
  status: string;
  progress: number;
  startDate?: string;
  targetDate?: string;
  completionDate?: string;
  responsiblePerson: string;
}

export interface TimelineView extends BaseOperationalView {
  academicYear: string;
  activities: TimelineActivityNode[];
}
