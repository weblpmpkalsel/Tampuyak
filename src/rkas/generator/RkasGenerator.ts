import { RkasGenerationRequest, RkasModel, RkasGenerationMetadata } from './RkasGeneratorTypes';
import { RkasGeneratorResult } from './RkasGeneratorResult';
import { ReferenceMapper } from '../../reference/ReferenceMapper';
import { ReferenceResolver } from '../../reference/ReferenceResolver';
import { BudgetBuilder } from '../../budget/BudgetBuilder';
import { BudgetStructure } from '../../budget/BudgetTypes';

export class RkasGenerator {
  public static generate(request: RkasGenerationRequest): RkasGeneratorResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const budgetStructures: BudgetStructure[] = [];
    
    let successfulGenerations = 0;
    let failedGenerations = 0;

    for (const planningActivity of request.planningActivities) {
      // 1. Master Data (optional validation/fallback)
      const referenceRequest = ReferenceMapper.mapToRequest(planningActivity, request.year);
      const referenceResult = ReferenceResolver.resolve([referenceRequest]);
      
      let resolvedRef = undefined;
      if (referenceResult.success && referenceResult.resolvedReferences.length > 0) {
        resolvedRef = referenceResult.resolvedReferences[0];
      }

      // 2. Budget Builder (Planning metadata becomes AUTHORITATIVE)
      const budgetResult = BudgetBuilder.build({
        resolvedReference: resolvedRef,
        year: request.year,
        planningActivity: planningActivity
      });

      if (!budgetResult.success || !budgetResult.budgetStructure) {
        errors.push(...budgetResult.errors);
        warnings.push(...budgetResult.warnings);
        failedGenerations++;
        continue;
      }
      
      warnings.push(...budgetResult.warnings);

      const programId = planningActivity.programId || resolvedRef?.program?.id || '-';
      
      // Look for an existing grouped structure
      const existingStructure = budgetStructures.find(s => s.metadata.generationId === programId);
      
      if (!existingStructure) {
        const structure = budgetResult.budgetStructure;
        // Mark this structure's generationId with the programId so we can find it
        structure.metadata.generationId = programId;
        
        // Use planningActivity for the program title, falling back to resolvedRef
        if (planningActivity.programName || planningActivity.program || planningActivity.activity) {
            structure.header.title = planningActivity.programName || planningActivity.program || planningActivity.activity;
        } else if (resolvedRef?.program) {
            structure.header.title = `${resolvedRef.program.code} - ${resolvedRef.program.name}`;
        }
        
        budgetStructures.push(structure);
      } else {
        existingStructure.lines.push(...budgetResult.budgetStructure.lines);
        existingStructure.totalAmount += budgetResult.budgetStructure.totalAmount || 0;
      }

      successfulGenerations++;
    }

    const rkas: RkasModel = {
      id: `RKAS-${request.year}-${Date.now()}`,
      year: request.year,
      budgetStructures,
      createdAt: Date.now()
    };

    const metadata: RkasGenerationMetadata = {
      processingTimeMs: Date.now() - startTime,
      totalActivitiesProcessed: request.planningActivities.length,
      successfulGenerations,
      failedGenerations
    };

    return {
      success: errors.length === 0,
      errors,
      warnings,
      rkas,
      metadata
    };
  }
}
