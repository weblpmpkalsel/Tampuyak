import { BaseOperationalView } from './BaseOperationalView';

export interface PerformanceIndicatorStats {
  indicatorId: string;
  target: number;
  achieved: number;
}

export interface AnalyticsView extends BaseOperationalView {
  academicYear: string;
  completionStatistics: {
    onTime: number;
    late: number;
    early: number;
  };
  riskStatistics: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  executionTrends: Record<string, any>;
  performanceIndicators: PerformanceIndicatorStats[];
  progressHistory: Array<{ timestamp: number; overallProgress: number }>;
}
