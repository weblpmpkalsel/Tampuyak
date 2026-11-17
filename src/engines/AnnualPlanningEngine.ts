/**
 * Tampuyak OS - Enterprise School Planning Platform
 * Phase 2.1: Annual Planning Foundation (RKT)
 * 
 * Annual Planning Engine
 * 100% independent from presentation (No UI, No Builder, No Viewer).
 * Generates the operational working copy from the LOCKED RKJM Single Source of Truth.
 */

import { KnowledgeGraph, CanonicalObject } from '../SPKG';
import { 
  AnnualPlanningDocument, 
  AnnualPlanningActivity, 
  TimelineModel, 
  BudgetReferenceModel, 
  ResponsibilityModel, 
  MonitoringPlaceholderModel 
} from '../models/AnnualPlanningModel';

export class AnnualPlanningEngine {
  private static instance: AnnualPlanningEngine;
  private workingCopies: Map<string, AnnualPlanningDocument> = new Map();

  private constructor() {}

  public static getInstance(): AnnualPlanningEngine {
    if (!AnnualPlanningEngine.instance) {
      AnnualPlanningEngine.instance = new AnnualPlanningEngine();
    }
    return AnnualPlanningEngine.instance;
  }

  /**
   * Generates a structural hash for the current RKJM state 
   * specifically filtered for elements relevant to this Academic Year.
   */
  private generateSourceHash(kg: KnowledgeGraph, academicYear: string): string {
    // In a production environment, this would deeply hash the relevant SPKG nodes
    // e.g., using SHA-256 over concatenated JSON representations of Programs/Activities
    // For this operational architecture, we return a simulated hash.
    const activities = kg.getNodesByType('Activity');
    const programs = kg.getNodesByType('StrategicProgram');
    
    // Simulate hashing
    const rawString = `${academicYear}-${activities.length}-${programs.length}-${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Translates a locked RKJM activity node into an operational working copy activity.
   */
  private buildWorkingCopyActivity(node: CanonicalObject): AnnualPlanningActivity {
    return {
      id: `ap-act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rkjmSourceId: node.id,
      strategicObjective: node.data?.strategicObjective || 'Objective reference',
      program: node.data?.program || 'Program reference',
      activity: node.title,
      subActivity: node.data?.subActivity || '',
      priority: node.data?.priority || 'Medium',
      target: node.data?.target || '',
      performanceIndicator: node.data?.indicator || '',
      timeline: {
        month: [],
        quarter: [],
        semester: 1
      },
      budgetReference: {
        budgetId: node.data?.budgetId || '',
        estimatedBudget: node.data?.estimatedBudget || 0,
        fundingSource: node.data?.fundingSource || 'BOSP'
      },
      responsibility: {
        responsibleUnit: node.data?.responsibleUnit || '',
        responsiblePerson: node.data?.responsiblePerson || '',
        supportingTeam: []
      },
      monitoring: {
        progress: 0,
        evidence: [],
        completionStatus: 'Draft',
        riskNotes: '',
        followUp: ''
      },
      isModifiedFromSource: false
    };
  }

  /**
   * Extracts data from RKJM Knowledge Graph and provisions an Annual Planning working copy
   */
  public generateAnnualPlan(rkjmId: string, academicYear: string): AnnualPlanningDocument {
    const kg = KnowledgeGraph.getInstance();
    
    const rkjmNode = kg.getNode(rkjmId);
    if (!rkjmNode || rkjmNode.type !== 'RKJM') {
      throw new Error("Invalid or missing RKJM single source of truth.");
    }

    const currentHash = this.generateSourceHash(kg, academicYear);
    
    // In actual implementation, we would filter activities specifically targeted for this academic year
    const rkjmActivities = kg.getNodesByType('Activity');
    
    const workingCopyActivities: AnnualPlanningActivity[] = rkjmActivities.map(node => 
      this.buildWorkingCopyActivity(node)
    );

    const doc: AnnualPlanningDocument = {
      id: `ap-${academicYear.replace('/', '-')}-${Date.now()}`,
      academicYear,
      sourceRkjmId: rkjmId,
      sourceHash: currentHash,
      rkjmVersion: rkjmNode.version,
      annualPlanningVersion: 1,
      currentVersion: 1,
      generatedDate: Date.now(),
      lastUpdated: Date.now(),
      needsRegeneration: false,
      schemaVersion: '1.0.0',
      generatedBy: 'System',
      modifiedFlag: false,
      activities: workingCopyActivities
    };

    this.workingCopies.set(doc.id, doc);
    return doc;
  }

  /**
   * Verifies if the RKJM single source of truth has drifted since this plan was generated.
   * Modifies the working copy's drift flag without overwriting the actual operational data.
   */
  public verifySynchronization(planId: string): boolean {
    const plan = this.workingCopies.get(planId);
    if (!plan) throw new Error("Annual Plan not found");

    const kg = KnowledgeGraph.getInstance();
    const rkjmNode = kg.getNode(plan.sourceRkjmId);
    
    if (!rkjmNode) {
        plan.needsRegeneration = true;
        return false;
    }

    const currentHash = this.generateSourceHash(kg, plan.academicYear);
    
    if (currentHash !== plan.sourceHash || rkjmNode.version > plan.rkjmVersion) {
      plan.needsRegeneration = true;
      plan.lastUpdated = Date.now();
      return false; // Desynchronized
    }

    plan.needsRegeneration = false;
    return true; // Synchronized
  }

  /**
   * Updates a specific activity within the working copy. 
   * This operates STRICTLY on the Annual Planning copy and NEVER modifies the RKJM KnowledgeGraph.
   */
  public updateOperationalActivity(planId: string, activityId: string, updates: Partial<AnnualPlanningActivity>): AnnualPlanningActivity {
    const plan = this.workingCopies.get(planId);
    if (!plan) throw new Error("Annual Plan not found");

    const activityIndex = plan.activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) throw new Error("Activity not found in this Annual Plan");

    const activity = plan.activities[activityIndex];
    
    // Apply updates
    plan.activities[activityIndex] = {
      ...activity,
      ...updates,
      isModifiedFromSource: true
    };

    plan.currentVersion += 1;
    plan.annualPlanningVersion += 1;
    plan.lastUpdated = Date.now();

    return plan.activities[activityIndex];
  }

  public getPlan(planId: string): AnnualPlanningDocument | undefined {
    return this.workingCopies.get(planId);
  }
}
