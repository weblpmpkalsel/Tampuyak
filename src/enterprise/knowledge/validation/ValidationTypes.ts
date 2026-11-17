export type ValidationSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
export type ValidationStatus = 'PASS' | 'WARNING' | 'ERROR';

export interface ValidationIssue {
  field: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationResult {
  status: ValidationStatus;
  issues: ValidationIssue[];
}

export interface ProcessingMetadata {
  processedAt: string;
  serviceVersion: string;
  sourceVersion: string;
}
