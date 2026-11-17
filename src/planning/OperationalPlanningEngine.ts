import { PlanningYear } from './PlanningYear';
import { PlanningDistribution } from './PlanningDistribution';
import { PlanningRecommendation } from './PlanningRecommendation';

export interface OperationalPlanningContext {
  planningVersion: string;
  schemaVersion: string;
  compatibilityVersion: string;
  sourceRkjmVersion: string;
  businessRuleVersion: string;
  referenceVersion: string;
  
  // Audit fields
  generatedAt: string;
  generatedBy: string;
  updatedAt: string;
  updatedBy: string;
  referencedSourceVersion: string;
  metadata: Record<string, any>;
}

export class OperationalPlanningEngine {
  private planningYears: Map<number, PlanningYear> = new Map();
  private distributions: Map<string, PlanningDistribution> = new Map();
  private recommendations: Map<string, PlanningRecommendation> = new Map();
  private context: OperationalPlanningContext | null = null;

  constructor() {}

  /**
   * Initializes or updates the context metadata for the orchestration.
   * This does NOT modify Execution or Annual Planning data.
   */
  public setContext(context: OperationalPlanningContext): void {
    this.context = context;
  }

  /**
   * Retrieves the current context and audit metadata.
   */
  public getContext(): OperationalPlanningContext | null {
    return this.context;
  }

  /**
   * Orchestration method to store a planning year reference.
   * NEVER duplicates actual execution or planning data.
   */
  public registerPlanningYear(year: PlanningYear): void {
    this.planningYears.set(year.yearNumber, year);
  }

  /**
   * Orchestration method to store distribution metadata.
   */
  public registerDistribution(distribution: PlanningDistribution): void {
    this.distributions.set(distribution.activityReferenceId, distribution);
  }

  /**
   * Orchestration method to store a recommendation.
   */
  public registerRecommendation(recommendation: PlanningRecommendation): void {
    this.recommendations.set(recommendation.recommendationId, recommendation);
  }

  /**
   * Exposes read-only access to a PlanningYear.
   */
  public getPlanningYear(yearNumber: number): PlanningYear | undefined {
    return this.planningYears.get(yearNumber);
  }

  /**
   * Exposes read-only access to all PlanningYears.
   */
  public getAllPlanningYears(): PlanningYear[] {
    return Array.from(this.planningYears.values());
  }

  /**
   * Exposes read-only access to a PlanningDistribution by activity reference ID.
   */
  public getPlanningDistribution(activityReferenceId: string): PlanningDistribution | undefined {
    return this.distributions.get(activityReferenceId);
  }

  /**
   * Exposes read-only access to all distributions for a specific year.
   */
  public getPlanningDistributionsForYear(yearNumber: number): PlanningDistribution[] {
    return Array.from(this.distributions.values()).filter(
      (d) => d.planningYear === yearNumber
    );
  }

  /**
   * Returns summary metadata for a given planning year.
   */
  public getPlanningSummary(yearNumber: number): any {
    const year = this.getPlanningYear(yearNumber);
    if (!year) return null;
    return year.summaryMetadata;
  }

  /**
   * Exposes read-only access to a PlanningRecommendation.
   */
  public getRecommendation(recommendationId: string): PlanningRecommendation | undefined {
    return this.recommendations.get(recommendationId);
  }

  /**
   * Exposes read-only access to all PlanningRecommendations.
   */
  public getAllRecommendations(): PlanningRecommendation[] {
    return Array.from(this.recommendations.values());
  }
}
