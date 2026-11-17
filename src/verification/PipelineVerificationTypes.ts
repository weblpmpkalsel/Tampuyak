export type VerificationStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'SKIPPED';

export interface VerificationStep {
  name: string;
  description: string;
  status: VerificationStatus;
  startTime?: number;
  endTime?: number;
  elapsedMs?: number;
  errors: string[];
  warnings: string[];
}

export interface VerificationRequest {
  verifyWorkspaceAdapter: boolean;
  verifyGenerationService: boolean;
  verifyGenerator: boolean;
  verifyReferenceLayer: boolean;
  verifyRecommendationLayer: boolean;
  verifyValidationLayer: boolean;
  verifyBudgetBuilder: boolean;
}

export interface VerificationMetadata {
  timestamp: number;
  environment: string;
  version: string;
}

export interface VerificationSummary {
  totalSteps: number;
  successfulSteps: number;
  failedSteps: number;
  skippedSteps: number;
  totalElapsedMs: number;
}
