/**
 * Tampuyak OS - Enterprise School Planning Platform
 * Phase 2.1: Annual Planning Foundation (RKT)
 * 
 * Annual Planning Model
 * Acts as the operational layer between RKJM and RKT.
 * Serves as a Working Copy; changes here NEVER modify RKJM.
 */

export type AnnualPlanningStatus = 'Draft' | 'Approved' | 'InProgress' | 'Completed' | 'Delayed' | 'Cancelled';

export interface TimelineModel {
  month: number[]; // 1-12
  quarter: number[]; // 1-4
  semester: number; // 1 or 2
  startDate?: string; // ISO Date String
  targetDate?: string; // ISO Date String
  completionDate?: string; // ISO Date String
  dependencies?: string[];
  calendarTags?: string[];
  priorityScore?: number;
}

export interface BudgetReferenceModel {
  budgetId: string;
  estimatedBudget: number;
  fundingSource: string; // e.g., "BOS", "Komite", "BOSP"
  budgetStatus?: string;
  budgetCategory?: string;
  budgetNotes?: string;
}

export interface ResponsibilityModel {
  responsibleUnit: string;
  responsiblePerson: string;
  supportingTeam: string[];
  approvalRole?: string;
  reviewRole?: string;
}

export interface MonitoringPlaceholderModel {
  progress: number; // 0-100 percentage
  evidence: string[]; // Links or IDs of evidence documents
  completionStatus: AnnualPlanningStatus;
  riskNotes: string;
  issue?: string;
  recommendation?: string;
  followUp: string;
  updatedAt?: number;
  updatedBy?: string;
}

export interface AnnualPlanningActivity {
  id: string; // Working copy ID
  rkjmSourceId: string; // Reference to RKJM Activity Node ID
  
  // Base Information
  strategicObjective: string;
  program: string;
  activity: string;
  subActivity: string;
  priority: string;
  
  // Operation specifics
  target: string;
  performanceIndicator: string;
  
  // Structured working copy fields
  timeline: TimelineModel;
  budgetReference: BudgetReferenceModel;
  responsibility: ResponsibilityModel;
  monitoring: MonitoringPlaceholderModel;
  
  // Working Copy Flags
  isModifiedFromSource: boolean;
}

export interface AnnualPlanningDocument {
  id: string;
  academicYear: string; // e.g., "2026/2027"
  
  // Link to single source of truth
  sourceRkjmId: string;
  sourceHash: string; // Hash of the RKJM elements to detect drifts
  
  // Versioning & Lifecycle
  rkjmVersion: number;
  annualPlanningVersion: number;
  currentVersion: number;
  
  generatedDate: number; // Unix timestamp
  lastUpdated: number; // Unix timestamp
  needsRegeneration: boolean; // Flag to indicate RKJM source has drifted
  
  // Extended Metadata Phase 2.1.1
  schemaVersion?: string;
  generatedBy?: string;
  modifiedFlag?: boolean;
  
  // The operational working copy data
  activities: AnnualPlanningActivity[];
}
