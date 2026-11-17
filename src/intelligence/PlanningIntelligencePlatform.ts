import { ContextBuilder } from './ContextBuilder';
import { PromptBuilder, PromptStructure } from './PromptBuilder';
import { ResponseValidator } from './ResponseValidator';
import { ProviderAdapter, ProviderRequest, ProviderResponse } from './ProviderAdapter';
import { SuggestionPackage } from './SuggestionPackage';
import { AnnualPlanningActivity } from '../models/AnnualPlanningModel';

export class PlanningIntelligencePlatform {
  private static instance: PlanningIntelligencePlatform;
  private contextBuilder: ContextBuilder;
  private promptBuilder: PromptBuilder;
  private responseValidator: ResponseValidator;

  private constructor() {
    this.contextBuilder = new ContextBuilder();
    this.promptBuilder = new PromptBuilder();
    this.responseValidator = new ResponseValidator();
  }

  public static getInstance(): PlanningIntelligencePlatform {
    if (!PlanningIntelligencePlatform.instance) {
      PlanningIntelligencePlatform.instance = new PlanningIntelligencePlatform();
    }
    return PlanningIntelligencePlatform.instance;
  }

  /**
   * Generates a suggestion package using the specified provider.
   * This is the orchestration method.
   */
  public async generateSuggestion(
    activity: AnnualPlanningActivity,
    academicYear: string,
    provider: ProviderAdapter
  ): Promise<SuggestionPackage> {
    
    // 1. Context Building (including Rule Injection)
    const context = this.contextBuilder.buildContext(activity, academicYear);

    // 2. Prompt Building
    const prompts: PromptStructure = this.promptBuilder.buildPrompt(context);

    // 3. Provider execution (No actual LLM call in this phase, conceptual architecture)
    const request: ProviderRequest = provider.buildRequest(prompts);
    const response: ProviderResponse = await provider.submitRequest(request);
    
    // 4. Contract Normalization
    const contract = provider.normalizeOutput(response);

    // 5. Validation
    const validationResult = this.responseValidator.validate(contract);

    // 6. Packaging
    const pkg = new SuggestionPackage(contract);
    pkg.setValidationResult(validationResult);

    if (pkg.status === 'Validated') {
      pkg.updateStatus('Pending Review'); // Ready for human review
    }

    return pkg;
  }
}
