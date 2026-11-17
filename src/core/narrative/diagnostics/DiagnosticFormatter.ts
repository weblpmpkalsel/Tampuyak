import { DiagnosticReport } from './DiagnosticTypes';

export class DiagnosticFormatter {
  public formatText(report: DiagnosticReport): string {
    let text = `Narrative Health: ${report.health}\n`;
    text += `Overall Score: ${report.scores.overallScore}\n`;
    text += `Total Issues: ${report.summary.totalIssues} (Critical: ${report.summary.totalCritical}, Errors: ${report.summary.totalErrors}, Warnings: ${report.summary.totalWarnings})\n\n`;

    if (report.issues.length > 0) {
      text += `Issues:\n`;
      report.issues.forEach(issue => {
        text += `[${issue.severity}] [${issue.category}] ${issue.message}\n`;
      });
    }

    if (report.recommendations.length > 0) {
      text += `\nRecommendations:\n`;
      report.recommendations.forEach(rec => {
        text += `- ${rec}\n`;
      });
    }

    return text;
  }
}
