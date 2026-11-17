export type RuleCategory = 
  | 'Priority' 
  | 'Timeline' 
  | 'Dependency' 
  | 'Budget' 
  | 'Monitoring' 
  | 'Validation' 
  | 'Execution' 
  | 'Approval' 
  | 'Calendar' 
  | 'Compliance';

export type RuleSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Warning' | 'Info';

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: RuleSeverity;
  priority: number; // Execution priority
  enabled: boolean;
  version: string;
  
  // Logical definitions (metadata only for now)
  condition?: string; // e.g., JSON schema or logical expression placeholder
  action?: string; // Expected action if matched
  
  notes?: string;
  metadata?: Record<string, any>;
  
  createdDate: number;
  lastUpdated: number;
}
