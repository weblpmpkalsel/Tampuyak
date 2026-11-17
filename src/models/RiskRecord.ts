export type RiskLikelihood = 'Low' | 'Medium' | 'High';
export type RiskImpact = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskStatus = 'Identified' | 'Mitigating' | 'Resolved' | 'Realized';

export interface RiskRecord {
  riskId: string;
  category: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  mitigation: string;
  owner: string;
  status: RiskStatus;
}
