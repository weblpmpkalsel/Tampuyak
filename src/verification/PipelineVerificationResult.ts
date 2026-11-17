import { VerificationStep, VerificationSummary, VerificationMetadata } from './PipelineVerificationTypes';

export interface PipelineVerificationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  steps: VerificationStep[];
  summary: VerificationSummary;
  metadata: VerificationMetadata;
}
