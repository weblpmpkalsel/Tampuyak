import { GenerateRkasRequest, GenerateRkasResponse } from './RkasServiceTypes';
import { RkasGenerator } from '../generator/RkasGenerator';
import { RkasGenerationRequest } from '../generator/RkasGeneratorTypes';

export class RkasGenerationService {
  /**
   * Enterprise RKAS Integration Service entry point.
   * Bridges the existing RKAS application to the completed Enterprise Budget Pipeline.
   * Coordinates application requests and invokes the RKAS Generator.
   */
  public static generate(request: GenerateRkasRequest): GenerateRkasResponse {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validate request format only (No business logic)
    if (!request) {
      return this.createFailureResult(['Request payload is required.']);
    }
    
    if (!request.year || request.year <= 0) {
      errors.push('Valid generation year is required.');
    }
    
    if (!request.planningActivities || !Array.isArray(request.planningActivities)) {
      errors.push('Planning activities array is required.');
    }
    
    if (!request.recommendationCandidates || !Array.isArray(request.recommendationCandidates)) {
      errors.push('Recommendation candidates array is required.');
    }
    
    if (!request.context || !request.context.workspaceId) {
      errors.push('Workspace context with valid workspaceId is required.');
    }

    if (errors.length > 0) {
      return this.createFailureResult(errors);
    }

    // 2. Map Application Request to Generator Request
    const generatorRequest: RkasGenerationRequest = {
      planningActivities: request.planningActivities,
      year: request.year,
      recommendationCandidates: request.recommendationCandidates,
      existingActivities: request.existingActivities
    };

    try {
      // 3. Invoke RKAS Generator (Locked Architecture)
      const generatorResult = RkasGenerator.generate(generatorRequest);

      // 4. Map Result to Enterprise Response Model
      return {
        success: generatorResult.success,
        errors: generatorResult.errors || [],
        warnings: generatorResult.warnings || [],
        result: generatorResult.rkas,
        metadata: generatorResult.metadata
      };
    } catch (error: any) {
      return this.createFailureResult([`Unexpected error during generation: ${error.message}`]);
    }
  }

  private static createFailureResult(errors: string[]): GenerateRkasResponse {
    return {
      success: false,
      errors,
      warnings: [],
      result: undefined,
      metadata: undefined
    };
  }
}
