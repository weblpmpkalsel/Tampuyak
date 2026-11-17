import { GenerationIssue, GenerationMetadata } from './GenerationTypes';

export interface GenerationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  validationPassed: boolean;
  issues: GenerationIssue[];
  metadata?: GenerationMetadata;
}
