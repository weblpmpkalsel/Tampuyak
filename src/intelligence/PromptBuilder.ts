import { PlanningContext } from '../models/PlanningContext';

export interface PromptStructure {
  systemPrompt: string;
  developerPrompt: string;
  userPrompt: string;
  contextBlock: string;
  rulesBlock: string;
  outputSchema: string; // JSON Schema definition
}

export class PromptBuilder {
  /**
   * Converts structured context into provider-neutral prompts.
   * Externalized templates would be loaded here in a real implementation.
   */
  public buildPrompt(context: PlanningContext, promptVersion: string = '1.0.0'): PromptStructure {
    const contextBlock = JSON.stringify({
      academicYear: context.academicYear,
      activity: context.targetActivity,
      metadata: context.planningMetadata
    }, null, 2);

    const rulesBlock = JSON.stringify(context.activeRules.map(r => ({
      ruleId: r.id,
      category: r.category,
      description: r.description
    })), null, 2);

    const outputSchema = JSON.stringify({
      type: 'object',
      properties: {
        suggestionType: { type: 'string' },
        prioritySuggestion: { type: 'string' },
        timelineSuggestion: {
          type: 'object',
          properties: {
            optimalStartDate: { type: 'string' },
            dependencies: { type: 'array', items: { type: 'string' } }
          }
        },
        responsiblePersonSuggestion: { type: 'string' },
        reasoningSummary: { type: 'string' },
        confidenceScore: { type: 'number' },
        warnings: { type: 'array', items: { type: 'string' } }
      },
      required: ['suggestionType', 'reasoningSummary', 'confidenceScore']
    }, null, 2);

    return {
      systemPrompt: 'You are an enterprise planning intelligence assistant.',
      developerPrompt: `Use Schema Version: ${promptVersion}. Adhere strictly to rules.`,
      userPrompt: 'Provide planning suggestions for the given activity context.',
      contextBlock,
      rulesBlock,
      outputSchema
    };
  }
}
