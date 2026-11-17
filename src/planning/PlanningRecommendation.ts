export interface PlanningRecommendation {
  recommendationId: string;
  recommendationType: string;
  reason: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED';
  metadata: Record<string, any>;
}
