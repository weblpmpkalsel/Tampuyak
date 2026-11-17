import { SuggestionContract } from './SuggestionContract';
import { IntelligenceValidationResult } from '../models/ValidationResult';
import { SuggestionStatus } from '../models/PlanningSuggestion';

export class SuggestionPackage {
  public packageId: string;
  public contract: SuggestionContract;
  public validationResult?: IntelligenceValidationResult;
  public status: SuggestionStatus;

  constructor(contract: SuggestionContract) {
    this.packageId = `pkg-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}`;
    this.contract = contract;
    this.status = 'Generated';
  }

  public setValidationResult(result: IntelligenceValidationResult): void {
    this.validationResult = result;
    if (result.isValid) {
      this.status = 'Validated';
    } else {
      this.status = 'Rejected';
    }
  }

  public updateStatus(newStatus: SuggestionStatus): void {
    this.status = newStatus;
  }
}
