import { DiagnosticCategory } from './DiagnosticCategory';
import { DiagnosticSeverity } from './DiagnosticSeverity';
import { NarrativeHealth } from './NarrativeHealth';

export interface DiagnosticIssue {
  id: string;
  ruleId: string;
  category: DiagnosticCategory;
  severity: DiagnosticSeverity;
  message: string;
  nodeId?: string;
  context?: any;
}

export interface QualityScoreDetails {
  grammarScore: number;
  readabilityScore: number;
  consistencyScore: number;
  traceabilityScore: number;
  coverageScore: number;
  completenessScore: number;
  formattingScore: number;
  metadataScore: number;
  overallScore: number;
}

export interface QualityMetrics {
  averageSentenceLength: number;
  paragraphDensity: number;
  headingBalance: number;
  sectionBalance: number;
  wordDiversity: number;
  repetitionRatio: number;
  transitionQuality: number;
}

export interface DiagnosticReport {
  summary: {
    totalIssues: number;
    totalWarnings: number;
    totalErrors: number;
    totalCritical: number;
  };
  issues: DiagnosticIssue[];
  metrics: QualityMetrics;
  scores: QualityScoreDetails;
  health: NarrativeHealth;
  recommendations: string[];
}
