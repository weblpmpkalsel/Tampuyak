import { BudgetStructure } from './BudgetTypes';

export interface BudgetResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  budgetStructure?: BudgetStructure;
  metadata?: Record<string, any>;
}
