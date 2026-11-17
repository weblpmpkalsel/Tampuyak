import { IASTNode } from '../ast/ASTTypes';
import { DiagnosticRegistry } from './DiagnosticRegistry';
import { DiagnosticCollector } from './DiagnosticCollector';
import { DiagnosticSerializer } from './DiagnosticSerializer';
import { DiagnosticFormatter } from './DiagnosticFormatter';
import { DiagnosticReport, DiagnosticIssue, QualityMetrics, QualityScoreDetails } from './DiagnosticTypes';
import { NarrativeHealth } from './NarrativeHealth';
import { DiagnosticSeverity } from './DiagnosticSeverity';

export class NarrativeDiagnosticsEngine {
  private _registry: DiagnosticRegistry;
  private _collector: DiagnosticCollector;
  private _serializer: DiagnosticSerializer;
  private _formatter: DiagnosticFormatter;

  constructor() {
    this._registry = new DiagnosticRegistry();
    this._collector = new DiagnosticCollector(this._registry);
    this._serializer = new DiagnosticSerializer();
    this._formatter = new DiagnosticFormatter();
  }

  public get registry(): DiagnosticRegistry {
    return this._registry;
  }

  public get serializer(): DiagnosticSerializer {
    return this._serializer;
  }

  public get formatter(): DiagnosticFormatter {
    return this._formatter;
  }

  public async evaluate(ast: IASTNode): Promise<DiagnosticReport> {
    const issues = await this._collector.collect(ast);
    const metrics = this.calculateMetrics(ast);
    const scores = this.calculateScores(issues, metrics);
    const health = this.determineHealth(scores.overallScore);
    const recommendations = this.generateRecommendations(issues, scores);

    return {
      summary: {
        totalIssues: issues.length,
        totalWarnings: issues.filter(i => i.severity === DiagnosticSeverity.WARNING).length,
        totalErrors: issues.filter(i => i.severity === DiagnosticSeverity.ERROR).length,
        totalCritical: issues.filter(i => i.severity === DiagnosticSeverity.CRITICAL).length,
      },
      issues,
      metrics,
      scores,
      health,
      recommendations
    };
  }

  private calculateMetrics(ast: IASTNode): QualityMetrics {
    return {
      averageSentenceLength: 15,
      paragraphDensity: 3,
      headingBalance: 0.8,
      sectionBalance: 0.9,
      wordDiversity: 0.7,
      repetitionRatio: 0.1,
      transitionQuality: 0.85
    };
  }

  private calculateScores(issues: DiagnosticIssue[], metrics: QualityMetrics): QualityScoreDetails {
    // Basic placeholder scoring logic
    let score = 100;
    
    for (const issue of issues) {
      if (issue.severity === DiagnosticSeverity.CRITICAL) score -= 20;
      else if (issue.severity === DiagnosticSeverity.ERROR) score -= 10;
      else if (issue.severity === DiagnosticSeverity.WARNING) score -= 5;
      else if (issue.severity === DiagnosticSeverity.SUGGESTION) score -= 1;
    }

    score = Math.max(0, Math.min(100, score));

    return {
      grammarScore: score,
      readabilityScore: score,
      consistencyScore: score,
      traceabilityScore: score,
      coverageScore: score,
      completenessScore: score,
      formattingScore: score,
      metadataScore: score,
      overallScore: score
    };
  }

  private determineHealth(overallScore: number): NarrativeHealth {
    if (overallScore >= 90) return NarrativeHealth.EXCELLENT;
    if (overallScore >= 75) return NarrativeHealth.GOOD;
    if (overallScore >= 60) return NarrativeHealth.FAIR;
    if (overallScore >= 40) return NarrativeHealth.NEEDS_IMPROVEMENT;
    return NarrativeHealth.CRITICAL;
  }

  private generateRecommendations(issues: DiagnosticIssue[], scores: QualityScoreDetails): string[] {
    const recommendations: string[] = [];
    if (scores.overallScore < 100) {
      recommendations.push('Review the reported issues to improve overall narrative quality.');
    }
    return recommendations;
  }
}
