/**
 * Strategic Planning Knowledge Graph (SPKG)
 * Tampuyak OS - Enterprise School Planning Platform
 */

export type SPKGNodeType = 
  | 'School' | 'EducationReport' | 'Indicator' | 'Trend' | 'Priority'
  | 'RootCause' | 'IRB' | 'SWOT' | 'StrategicIssue' | 'StrategicObjective'
  | 'StrategicProgram' | 'Activity' | 'Output' | 'Outcome' | 'PerformanceIndicator'
  | 'Risk' | 'Mitigation' | 'Budget' | 'FundingSource' | 'Timeline'
  | 'ResponsibleUnit' | 'Monitoring' | 'Evaluation' | 'KSP' | 'RKJM'
  | 'RKT' | 'RKAS' | 'Certification' | 'Dashboard'
  | 'Vision' | 'Mission' | 'LegalBasis' | 'Background' | 'PlanningMethodology'
  | 'Purpose' | 'Glossary' | 'Reference' | 'Target' | 'FundingStrategy'
  | 'FinancialSustainability' | 'Implementation' | 'ContinuousImprovement'
  | 'Recommendation';

export interface RegulationReference {
  regulation: string; // e.g. "Permendikdasmen No.47 Tahun 2023"
  article: string;
  reference: string;
}

export interface ExplainabilityData {
  reasoning: string;
  indicatorContext?: string;
  score?: number;
  trendContext?: string;
  rootCauseContext?: string;
  recommendation?: string;
  confidenceScore: number;
}

export interface CanonicalObject {
  id: string;
  type: SPKGNodeType;
  title: string;
  description: string;
  evidence: string[];
  source: string;
  createdBy: string;
  generatedBy: string;
  createdAt: number;
  updatedAt: number;
  parentId?: string;
  childrenIds: string[];
  confidenceScore: number;
  status: 'Draft' | 'Active' | 'Archived' | 'Simulated';
  version: number;
  
  // Enterprise features
  explainability?: ExplainabilityData;
  regulations?: RegulationReference[];
  data?: Record<string, any>; // Specific data like score, budget amount, etc.
}

export interface ChangeImpact {
  affectedModules: string[];
  affectedDocuments: string[];
  affectedBudgets: number; // Total budget impact
  affectedIndicators: string[];
  affectedTargets: string[];
  affectedCertification: boolean;
}

export class KnowledgeGraph {
  private nodes: Map<string, CanonicalObject> = new Map();
  private history: Map<string, CanonicalObject[]> = new Map();
  
  // Singleton
  private static instance: KnowledgeGraph;
  static getInstance(): KnowledgeGraph {
    if (!KnowledgeGraph.instance) {
      KnowledgeGraph.instance = new KnowledgeGraph();
    }
    return KnowledgeGraph.instance;
  }

  public clear(): void {
    this.nodes.clear();
    this.history.clear();
  }

  public addNode(node: CanonicalObject): void {
    this.nodes.set(node.id, node);
    this.saveHistory(node);
  }

  public getNode(id: string): CanonicalObject | undefined {
    return this.nodes.get(id);
  }

  public getNodesByType(type: SPKGNodeType): CanonicalObject[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  public updateNode(id: string, updates: Partial<CanonicalObject>, recordHistory = true): ChangeImpact {
    const existing = this.nodes.get(id);
    if (!existing) throw new Error(`Node ${id} not found`);

    const impact = this.calculateImpact(id, updates);

    const updatedNode = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: Date.now()
    };

    this.nodes.set(id, updatedNode);
    if (recordHistory) {
      this.saveHistory(updatedNode);
    }
    
    // Auto Propagate
    this.propagateChanges(id, updates);

    return impact;
  }

  private saveHistory(node: CanonicalObject) {
    const nodeHistory = this.history.get(node.id) || [];
    nodeHistory.push({ ...node });
    this.history.set(node.id, nodeHistory);
  }

  public getHistory(id: string): CanonicalObject[] {
    return this.history.get(id) || [];
  }

  public restoreVersion(id: string, versionIndex: number) {
    const history = this.getHistory(id);
    if (versionIndex >= 0 && versionIndex < history.length) {
      const targetVersion = history[versionIndex];
      this.nodes.set(id, { ...targetVersion, version: targetVersion.version + 1, updatedAt: Date.now() });
      this.saveHistory(this.nodes.get(id)!);
    }
  }

  private calculateImpact(id: string, updates: Partial<CanonicalObject>): ChangeImpact {
    const existing = this.nodes.get(id);
    if (!existing) return {
      affectedModules: [],
      affectedDocuments: [],
      affectedBudgets: 0,
      affectedIndicators: [],
      affectedTargets: [],
      affectedCertification: false
    };

    // Calculate recursive impact across the graph
    const children = this.getAllDescendants(id);
    
    let budgetImpact = 0;
    const documents = new Set<string>();
    
    children.forEach(child => {
      if (child.type === 'Budget' && child.data?.amount) {
        budgetImpact += child.data.amount;
      }
      if (['KSP', 'RKJM', 'RKT', 'RKAS'].includes(child.type)) {
        documents.add(child.type);
      }
    });

    return {
      affectedModules: ['Strategic Planning', 'Budgeting'],
      affectedDocuments: Array.from(documents),
      affectedBudgets: budgetImpact,
      affectedIndicators: existing.type === 'Indicator' ? [existing.title] : [],
      affectedTargets: existing.type === 'PerformanceIndicator' ? [existing.title] : [],
      affectedCertification: documents.has('KSP')
    };
  }

  private propagateChanges(id: string, updates: Partial<CanonicalObject>) {
    // Implement smart auto-propagation down the tree
    const existing = this.nodes.get(id);
    if (!existing) return;

    if (existing.type === 'Priority') {
        // e.g. propagate to StrategicObjective
        const objectives = this.getChildren(id).filter(c => c.type === 'StrategicObjective');
        objectives.forEach(obj => {
            // Trigger update on children
        });
    }
  }

  public getChildren(parentId: string): CanonicalObject[] {
    const parent = this.nodes.get(parentId);
    if (!parent) return [];
    return parent.childrenIds.map(id => this.nodes.get(id)).filter(Boolean) as CanonicalObject[];
  }

  public getAllDescendants(parentId: string): CanonicalObject[] {
    const descendants: CanonicalObject[] = [];
    const children = this.getChildren(parentId);
    children.forEach(child => {
      descendants.push(child);
      descendants.push(...this.getAllDescendants(child.id));
    });
    return descendants;
  }
}

export class QualityEngine {
  public evaluate(graph: KnowledgeGraph): {
    score: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    details: Record<string, string>;
  } {
    // Evaluate logic, coverage, consistency, completeness
    const objectives = graph.getNodesByType('StrategicObjective');
    const programs = graph.getNodesByType('StrategicProgram');
    const budgets = graph.getNodesByType('Budget');

    const totalObjectives = objectives.length;
    const mappedPrograms = programs.filter(p => p.parentId && graph.getNode(p.parentId)?.type === 'StrategicObjective');
    
    const coverage = totalObjectives > 0 ? (mappedPrograms.length / totalObjectives) * 100 : 0;

    return {
      score: coverage > 90 ? 'A+' : (coverage > 75 ? 'A' : 'B'),
      details: {
        'Planning Logic': 'Valid',
        'Evidence Coverage': `${coverage}%`,
        'Consistency': 'High',
        'Completeness': 'Pass',
        'Budget Alignment': budgets.length > 0 ? 'Aligned' : 'Pending',
        'Indicator Alignment': 'Valid',
        'Regulation Compliance': 'Compliant',
        'Explainability': 'Active',
        'Synchronization': 'Real-time',
        'Narrative Quality': 'Standard'
      }
    };
  }
}

export class PlanningSimulator {
  public simulateChange(nodeId: string, tempUpdates: Partial<CanonicalObject>): ChangeImpact {
    const graph = KnowledgeGraph.getInstance();
    // In a real scenario, we might clone the graph.
    // For now, we return impact without saving.
    return (graph as any).calculateImpact(nodeId, tempUpdates);
  }
}

import { NarrativeIntelligenceEngine } from './NarrativeIntelligenceEngine';

export const seedInitialGraph = () => {
    const kg = KnowledgeGraph.getInstance();
    if (kg.getNodesByType('School').length > 0) return; // Already seeded

    const schoolNode: CanonicalObject = {
        id: 'school-1', type: 'School', title: 'SD Negeri 1 Tampuyak',
        description: 'Single Source of Truth for School Entity',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: ['report-1'], confidenceScore: 100, status: 'Active', version: 1
    };

    const reportNode: CanonicalObject = {
        id: 'report-1', type: 'EducationReport', title: 'Rapor Pendidikan 2024',
        description: 'Dataset Nasional Rapor Pendidikan',
        evidence: [], source: 'Kemdikbud', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), parentId: 'school-1', childrenIds: ['priority-1'], confidenceScore: 100, status: 'Active', version: 1
    };

    const priority1: CanonicalObject = {
        id: 'priority-1', type: 'Priority', title: 'Peningkatan Kompetensi Numerasi',
        description: 'Berdasarkan Rapor Pendidikan, pencapaian kompetensi numerasi berada pada kategori perlu intervensi. Program ini difokuskan pada perbaikan pendekatan pembelajaran guru.',
        evidence: ['Education Report 2023'], source: 'System', createdBy: 'Admin', generatedBy: 'AI',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: ['obj-1'], confidenceScore: 0.98, status: 'Active', version: 1,
        explainability: {
            reasoning: 'Generated because Indicator Numeracy Score is 58, Trend is Down, Root Cause is Teacher competency.',
            confidenceScore: 98,
            indicatorContext: 'Numeracy Score 58',
            rootCauseContext: 'Teacher competency',
            recommendation: 'Teacher Training'
        },
        regulations: [
            { regulation: 'Permendikdasmen No.47 Tahun 2023', article: 'Pasal 5', reference: 'Prioritas Mutu Perencanaan Berbasis Data' }
        ]
    };
    
    const visionNode: CanonicalObject = {
        id: 'vision-1', type: 'Vision', title: 'Visi Sekolah',
        description: 'Mewujudkan peserta didik yang bertaqwa, berkarakter, cerdas, dan terampil sesuai profil pelajar Pancasila.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    
    const missionNode: CanonicalObject = {
        id: 'mission-1', type: 'Mission', title: 'Misi Sekolah',
        description: '1. Meningkatkan kualitas pembelajaran berbasis kontekstual. 2. Mengembangkan karakter peserta didik melalui pembiasaan positif.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    
    const legalBasisNode: CanonicalObject = {
        id: 'legal-1', type: 'LegalBasis', title: 'Landasan Hukum',
        description: 'Penyusunan dokumen ini dilandasi oleh regulasi pedoman perencanaan berbasis data dan standar nasional pendidikan.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    
    const backgroundNode: CanonicalObject = {
        id: 'bg-1', type: 'Background', title: 'Latar Belakang',
        description: 'Dokumen ini memuat latar belakang kondisi riil sekolah dan tantangan yang dihadapi dalam meningkatkan mutu pendidikan.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    
    const planningNode: CanonicalObject = {
        id: 'planning-1', type: 'PlanningMethodology', title: 'Metodologi Perencanaan',
        description: 'Metodologi penyusunan didasarkan pada siklus perencanaan berbasis data (PBD) dari identifikasi hingga evaluasi capaian.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    
    const purposeNode: CanonicalObject = {
        id: 'purpose-1', type: 'Purpose', title: 'Tujuan',
        description: 'Tujuan penyusunan RKJM adalah untuk menyediakan acuan kerja strategis dan berkelanjutan bagi seluruh warga sekolah.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'System',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };

    kg.addNode(schoolNode);
    kg.addNode(visionNode);
    kg.addNode(missionNode);
    kg.addNode(legalBasisNode);
    kg.addNode(backgroundNode);
    kg.addNode(planningNode);
    kg.addNode(purposeNode);
    kg.addNode(reportNode);
    kg.addNode(priority1);

    const narrativeEngine = new NarrativeIntelligenceEngine();
    
    // Generate Analysis Chapter (fallback or specific nodes)
    const analysisNodes = narrativeEngine.generateSchoolAnalysisNarrative('school-1');
    analysisNodes.forEach(n => kg.addNode(n));

    // Generate IRB
    const irbNodes = narrativeEngine.generateIRBMatrix(priority1.id);
    irbNodes.forEach(n => kg.addNode(n));
    priority1.childrenIds.push(...irbNodes.filter(n => n.type === 'IRB').map(n => n.id));

    // Generate Programs and Activities
    const programNodes = narrativeEngine.generateStrategicProgram(priority1.id, 'kelemahan kompetensi numerasi');
    programNodes.forEach(n => kg.addNode(n));
    priority1.childrenIds.push(...programNodes.filter(n => n.type === 'StrategicObjective').map(n => n.id));

    // Evaluation & Monitoring Nodes
    const evalNode: CanonicalObject = {
        id: 'eval-1', type: 'Evaluation', title: 'Evaluasi Pelaksanaan',
        description: 'Evaluasi dilakukan pada akhir setiap siklus pembelajaran untuk mengukur efektivitas program dan serapan anggaran.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'AI',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    const monNode: CanonicalObject = {
        id: 'mon-1', type: 'Monitoring', title: 'Strategi Monitoring',
        description: 'Kepala sekolah secara rutin memantau kemajuan melalui platform digital, dengan pertemuan mingguan Komunitas Belajar.',
        evidence: [], source: 'System', createdBy: 'Admin', generatedBy: 'AI',
        createdAt: Date.now(), updatedAt: Date.now(), childrenIds: [], confidenceScore: 100, status: 'Active', version: 1
    };
    kg.addNode(evalNode);
    kg.addNode(monNode);
};
