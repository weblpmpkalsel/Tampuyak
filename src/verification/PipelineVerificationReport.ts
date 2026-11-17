import { PipelineVerificationResult } from './PipelineVerificationResult';

export class PipelineVerificationReport {
  public static generate(result: PipelineVerificationResult): string {
    const sb: string[] = [];
    
    sb.push('====================================================================');
    sb.push('ARCHITECTURE VERIFICATION REPORT');
    sb.push('Enterprise RKAS Pipeline Integration');
    sb.push('====================================================================');
    sb.push(`Timestamp: ${new Date(result.metadata.timestamp).toISOString()}`);
    sb.push(`Status: ${result.success ? 'PASSED' : 'FAILED'}`);
    sb.push(`Total Elapsed Time: ${result.summary.totalElapsedMs}ms`);
    sb.push('');
    sb.push('--- PIPELINE EXECUTION SEQUENCE ---');
    
    result.steps.forEach((step, index) => {
      sb.push(`${index + 1}. [${step.status}] ${step.name} (${step.elapsedMs || 0}ms)`);
      sb.push(`   Description: ${step.description}`);
      if (step.errors.length > 0) {
        sb.push(`   Errors:`);
        step.errors.forEach(err => sb.push(`     - ${err}`));
      }
    });

    sb.push('');
    sb.push('--- SUMMARY ---');
    sb.push(`Total Steps: ${result.summary.totalSteps}`);
    sb.push(`Successful: ${result.summary.successfulSteps}`);
    sb.push(`Failed: ${result.summary.failedSteps}`);
    sb.push(`Skipped: ${result.summary.skippedSteps}`);

    if (result.errors.length > 0) {
      sb.push('');
      sb.push('--- CRITICAL ERRORS ---');
      result.errors.forEach(err => sb.push(`❌ ${err}`));
    }

    if (result.warnings.length > 0) {
      sb.push('');
      sb.push('--- WARNINGS ---');
      result.warnings.forEach(warn => sb.push(`⚠️ ${warn}`));
    }

    sb.push('====================================================================');
    
    return sb.join('\n');
  }
}
