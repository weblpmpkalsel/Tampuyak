import { VerificationRequest, VerificationStep, VerificationStatus } from './PipelineVerificationTypes';
import { PipelineVerificationResult } from './PipelineVerificationResult';
import { WorkspaceAdapter, WorkspaceState } from '../rkas/workspace';
import { RkasGenerationService } from '../rkas/service';
import { RkasGenerator } from '../rkas/generator/RkasGenerator';
import { ReferenceResolver } from '../reference/ReferenceResolver';
import { RecommendationEngine } from '../recommendation/RecommendationEngine';
import { GenerationValidator } from '../generation/GenerationValidator';
import { BudgetBuilder } from '../budget/BudgetBuilder';

export class PipelineVerificationRunner {
  public static run(request: VerificationRequest): PipelineVerificationResult {
    const steps: VerificationStep[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const totalStartTime = Date.now();

    const executeStep = (name: string, description: string, shouldRun: boolean, task: () => void) => {
      const stepStartTime = Date.now();
      const step: VerificationStep = {
        name,
        description,
        status: shouldRun ? 'RUNNING' : 'SKIPPED',
        startTime: stepStartTime,
        errors: [],
        warnings: []
      };

      if (shouldRun) {
        try {
          task();
          step.status = 'SUCCESS';
        } catch (e: any) {
          step.status = 'FAILED';
          step.errors.push(e.message || 'Unknown error');
          errors.push(`Step [${name}] failed: ${e.message}`);
        }
      }

      step.endTime = Date.now();
      step.elapsedMs = step.endTime - stepStartTime;
      steps.push(step);
    };

    // 1. Workspace Adapter
    executeStep(
      'Workspace Adapter', 
      'Verify Workspace Adapter interface and translation', 
      request.verifyWorkspaceAdapter, 
      () => {
        if (!WorkspaceAdapter) throw new Error('WorkspaceAdapter not found');
        if (typeof WorkspaceAdapter.generate !== 'function') throw new Error('generate method missing');
      }
    );

    // 2. RKAS Generation Service
    executeStep(
      'RKAS Generation Service', 
      'Verify Enterprise Generation Service bridge', 
      request.verifyGenerationService, 
      () => {
        if (!RkasGenerationService) throw new Error('RkasGenerationService not found');
        if (typeof RkasGenerationService.generate !== 'function') throw new Error('generate method missing');
      }
    );

    // 3. RKAS Generator
    executeStep(
      'RKAS Generator', 
      'Verify RKAS Generator orchestrator', 
      request.verifyGenerator, 
      () => {
        if (!RkasGenerator) throw new Error('RkasGenerator not found');
        if (typeof RkasGenerator.generate !== 'function') throw new Error('generate method missing');
      }
    );

    // 4. Reference Layer
    executeStep(
      'Reference Layer', 
      'Verify Reference Resolution Engine', 
      request.verifyReferenceLayer, 
      () => {
        if (!ReferenceResolver) throw new Error('ReferenceResolver not found');
      }
    );

    // 5. Recommendation Layer
    executeStep(
      'Recommendation Layer', 
      'Verify Recommendation Engine', 
      request.verifyRecommendationLayer, 
      () => {
        if (!RecommendationEngine) throw new Error('RecommendationEngine not found');
      }
    );

    // 6. Generation Validation
    executeStep(
      'Generation Validation', 
      'Verify Generation Validation Layer', 
      request.verifyValidationLayer, 
      () => {
        if (!GenerationValidator) throw new Error('GenerationValidator not found');
      }
    );

    // 7. Budget Builder
    executeStep(
      'Budget Builder', 
      'Verify Budget Structure Builder', 
      request.verifyBudgetBuilder, 
      () => {
        if (!BudgetBuilder) throw new Error('BudgetBuilder not found');
      }
    );

    // Overall Simulation of full flow using test data
    executeStep(
      'End-to-End Pipeline Check',
      'Verify that WorkspaceAdapter can process a request without crashing architecture',
      true,
      () => {
        const testState: WorkspaceState = {
            activities: [],
            targetYear: 2026,
            recommendations: [],
            context: { workspaceId: 'verify-uuid', userId: 'system', role: 'admin', timestamp: Date.now() }
        };
        const res = WorkspaceAdapter.generate(testState);
        if (!res) throw new Error("No response from pipeline");
      }
    );

    const totalEndTime = Date.now();
    const successfulSteps = steps.filter(s => s.status === 'SUCCESS').length;
    const failedSteps = steps.filter(s => s.status === 'FAILED').length;
    const skippedSteps = steps.filter(s => s.status === 'SKIPPED').length;

    return {
      success: failedSteps === 0,
      errors,
      warnings,
      steps,
      summary: {
        totalSteps: steps.length,
        successfulSteps,
        failedSteps,
        skippedSteps,
        totalElapsedMs: totalEndTime - totalStartTime
      },
      metadata: {
        timestamp: totalStartTime,
        environment: 'verification',
        version: '1.0.0'
      }
    };
  }
}
