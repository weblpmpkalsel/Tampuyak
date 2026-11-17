import { BudgetMetadata } from './BudgetTypes';

export class BudgetMetadataBuilder {
  public static build(year: number): BudgetMetadata {
    return {
      generationTimestamp: Date.now(),
      planningYear: year,
      sourceModule: 'EnterpriseBudgetBuilder',
      pipelineVersion: '1.0.0',
      builderVersion: '1.0.0',
      generationId: `BGT-${year}-${Date.now()}`
    };
  }
}
