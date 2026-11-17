import { GenerationResult } from '../generation/GenerationResult';
import { ResolvedReference } from '../reference/ReferenceTypes';

export interface BudgetRequest {
  generationResult?: GenerationResult;
  resolvedReference?: ResolvedReference;
  year: number;
  planningActivity: any;
}

export interface BudgetActivity {
  id: string;
  code: string;
  name: string;
}

export interface BudgetComponent {
  id: string;
  name: string;
  category: string;
}

export interface BudgetFunding {
  source: string;
  description: string;
}

export interface BudgetAccount {
  code: string;
  name: string;
  type: string;
}

export interface BudgetLine {
  id: string;
  activity: BudgetActivity;
  component?: BudgetComponent;
  funding?: BudgetFunding;
  account?: BudgetAccount;
  year: number;
  volume: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface BudgetHeader {
  title: string;
  year: number;
}

export interface BudgetMetadata {
  generationTimestamp: number;
  planningYear: number;
  sourceModule: string;
  pipelineVersion: string;
  builderVersion: string;
  generationId: string;
}

export interface BudgetStructure {
  header: BudgetHeader;
  lines: BudgetLine[];
  totalAmount: number;
  metadata: BudgetMetadata;
}
