import { DiagnosticReport } from './DiagnosticTypes';

export class DiagnosticSerializer {
  public toJSON(report: DiagnosticReport, space: number = 2): string {
    return JSON.stringify(report, null, space);
  }

  public toCompactJSON(report: DiagnosticReport): string {
    return JSON.stringify(report);
  }

  public toAuditJSON(report: DiagnosticReport): string {
    const auditReport = {
      health: report.health,
      scores: report.scores,
      criticalIssues: report.issues.filter(i => i.severity === 'CRITICAL'),
      errors: report.issues.filter(i => i.severity === 'ERROR')
    };
    return JSON.stringify(auditReport, null, 2);
  }

  public toDeveloperJSON(report: DiagnosticReport): string {
    // For developers, include everything
    return this.toJSON(report, 2);
  }
}
