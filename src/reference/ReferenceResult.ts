import { ResolvedReference } from './ReferenceTypes';

export interface ReferenceResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  resolvedReferences: ResolvedReference[];
  metadata?: Record<string, any>;
}
