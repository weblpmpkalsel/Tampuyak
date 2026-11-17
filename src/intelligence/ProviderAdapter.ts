import { SuggestionContract } from './SuggestionContract';
import { PromptStructure } from './PromptBuilder';

export interface ProviderRequest {
  requestId: string;
  prompts: PromptStructure;
  providerOptions?: Record<string, any>;
}

export interface ProviderResponse {
  rawOutput: string;
  providerMetadata: Record<string, any>;
}

/**
 * Define a provider abstraction.
 * Every future provider (Gemini, OpenAI, etc.) must implement this interface.
 */
export interface ProviderAdapter {
  providerName: string;
  
  buildRequest(prompts: PromptStructure): ProviderRequest;
  submitRequest(request: ProviderRequest): Promise<ProviderResponse>;
  normalizeOutput(response: ProviderResponse): SuggestionContract;
}
