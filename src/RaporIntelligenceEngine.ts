// ==========================================
// RAPOR PENDIDIKAN INTELLIGENCE ENGINE (RPIE)
// ==========================================

export interface TrendData {
  status: 'Improving' | 'Declining' | 'Stable' | 'Unknown';
  trendValue: number;
  trendDirection: string;
  trendExplanation: string;
}

export interface ComparisonData {
  ranking?: number;
  percentile?: number;
  description: string;
  explanation: string;
}

export interface AchievementData {
  percentage: number;
  description: string;
  category: 'Excellent' | 'Good' | 'Moderate' | 'Needs Improvement' | 'Critical';
  narrative: string;
}

export interface EnhancedRootCause {
  primaryRootCause: string;
  secondaryRootCause: string;
  supportingEvidence: string;
  confidenceScore: number;
  sourceIndicatorIds: string[];
}

export interface RecommendationData {
  recommendationId: string;
  evidenceSource: string;
  priority: string;
  expectedImpact: string;
  relatedProgram: string;
  relatedRkjm: string;
  relatedRkt: string;
  relatedRkas: string;
}

export interface PlanningLinks {
  relatedSwot: string[];
  relatedIrb: string[];
  relatedSchoolDna: string[];
  relatedStrategicGoal: string[];
  relatedAnnualProgram: string[];
  relatedBudgetAllocation: string[];
}

export interface RootCause {
  id: string;
  description: string;
  evidence: string;
  relatedDimensionId: string;
  relatedElementId: string;
  primaryRootCause?: string;
  secondaryRootCause?: string;
  supportingEvidence?: string;
  confidenceScore?: number;
  sourceIndicatorIds?: string[];
}

export interface Indicator {
  id: string;
  name: string;
  dimensionId: string;
  elementId: string;
  value: number;
  target: number;
  gap: number; // Value - Target
  trend: 'Naik' | 'Turun' | 'Tetap';
  status: 'Hijau' | 'Kuning' | 'Merah';
  priorityScore: number;
  evidence: string;
  recommendations: string[];
  rootCauses: RootCause[];
}

export interface Element {
  id: string;
  name: string;
  indicators: Indicator[];
}

export interface Dimension {
  id: string;
  name: string;
  score: number;
  nationalBenchmark: number;
  provincialBenchmark: number;
  districtBenchmark: number;
  schoolBenchmark: number;
  trend: 'Naik' | 'Turun' | 'Tetap';
  category: 'Baik' | 'Sedang' | 'Kurang';
  priorityScore: number;
  elements: Element[];
  
  // REMA Enhancements
  officialDimensionName?: string;
  officialDisplayTitle?: string;
  performanceStatus?: 'Excellent' | 'Good' | 'Moderate' | 'Needs Improvement' | 'Critical';
  achievementSummary?: AchievementData;
  enhancedTrend?: TrendData;
  districtComparison?: ComparisonData;
  provincialComparison?: ComparisonData;
  nationalComparison?: ComparisonData;
  rootCauseSummary?: EnhancedRootCause;
  priorityCategory?: string;
  improvementRecommendation?: RecommendationData;
  relatedIrb?: string[];
  relatedSwot?: string[];
  relatedPlanningObjects?: PlanningLinks;
}

export interface SWOT {
  strengths: Indicator[];
  weaknesses: Indicator[];
  opportunities: Indicator[];
  threats: Indicator[];
}

export interface IRBAction {
  id: string;
  identifikasi: Indicator;
  refleksi: RootCause;
  benahi: string;
  rationale: string; // Education Reasoning Engine (Why)
}

export class RaporIntelligenceEngine {
  private dimensions: Dimension[] = [];
  
  public loadData(rawData: Record<string, any>, dictionary: any[]) {
    this.dimensions = [];
    
    // Parse dimensions from dictionary
    dictionary.forEach((dictDim) => {
      const dimId = dictDim.dimensi.split(":")[0].trim().replace("Dimensi ", "");
      const dimName = dictDim.dimensi;
      
      const elements: Element[] = [];
      const indicators: Indicator[] = [];
      
      dictDim.indikator.forEach((ind: any) => {
        const indValue = rawData[ind.id]?.nilai ? parseFloat(String(rawData[ind.id].nilai).replace(',', '.')) : 0;
        const target = 100; // Benchmark target
        const gap = target - indValue;
        
        let status: 'Hijau' | 'Kuning' | 'Merah' = 'Merah';
        if (indValue >= 80) status = 'Hijau';
        else if (indValue >= 60) status = 'Kuning';
        
        // Calculate priority (Gap -> Urgency -> Impact)
        let urgency = gap > 40 ? 3 : gap > 20 ? 2 : 1;
        let impact = dimId === 'A' || dimId === 'D' ? 3 : 2;
        let priorityScore = urgency * impact * gap;
        
        const rootCauses: RootCause[] = [];
        const recommendations: string[] = [];
        
        if (status !== 'Hijau') {
          rootCauses.push({
            id: `RC-${ind.id}-1`,
            description: `Kurangnya optimalisasi pada aspek ${ind.nama.toLowerCase()}`,
            evidence: `Capaian masih berada di angka ${indValue} (Kategori ${status})`,
            relatedDimensionId: dimId,
            relatedElementId: ind.id.split(".")[0]
          });
          recommendations.push(`Peningkatan kapasitas dan program intervensi untuk ${ind.nama.toLowerCase()}`);
        }
        
        const indicator: Indicator = {
          id: ind.id,
          name: ind.nama,
          dimensionId: dimId,
          elementId: ind.id.split(".")[0], // Simplified element ID mapping
          value: indValue,
          target,
          gap,
          trend: 'Tetap', // Could be calculated if historical data exists
          status,
          priorityScore,
          evidence: `Data Rapor Pendidikan: ${ind.nama} = ${indValue}`,
          recommendations,
          rootCauses
        };
        
        indicators.push(indicator);
      });
      
      // Group by Element
      const elementMap = new Map<string, Element>();
      indicators.forEach(ind => {
        if (!elementMap.has(ind.elementId)) {
          elementMap.set(ind.elementId, {
            id: ind.elementId,
            name: `Elemen ${ind.elementId}`,
            indicators: []
          });
        }
        elementMap.get(ind.elementId)!.indicators.push(ind);
      });
      
      elements.push(...Array.from(elementMap.values()));
      
      const dimScore = indicators.length > 0 ? indicators.reduce((acc, ind) => acc + ind.value, 0) / indicators.length : 0;
      
      this.dimensions.push({
        id: dimId,
        name: dimName,
        score: dimScore,
        nationalBenchmark: 70,
        provincialBenchmark: 65,
        districtBenchmark: 60,
        schoolBenchmark: 60,
        trend: 'Tetap',
        category: dimScore >= 80 ? 'Baik' : dimScore >= 60 ? 'Sedang' : 'Kurang',
        priorityScore: indicators.reduce((acc, ind) => acc + ind.priorityScore, 0),
        elements
      });
    });
  }

  public getDimensions(): Dimension[] {
    return this.dimensions;
  }
  
  public getAllIndicators(): Indicator[] {
    return this.dimensions.flatMap(d => d.elements.flatMap(e => e.indicators));
  }

  public getSWOT(): SWOT {
    const indicators = this.getAllIndicators();
    return {
      strengths: indicators.filter(i => i.status === 'Hijau').sort((a, b) => b.value - a.value),
      weaknesses: indicators.filter(i => i.status === 'Merah' || i.status === 'Kuning').sort((a, b) => b.priorityScore - a.priorityScore),
      opportunities: indicators.filter(i => i.status === 'Kuning' && i.trend === 'Naik'),
      threats: indicators.filter(i => i.status === 'Kuning' && i.trend === 'Turun')
    };
  }
  
  public getIRB(): IRBAction[] {
    const weaknesses = this.getSWOT().weaknesses;
    return weaknesses.map((ind, i) => ({
      id: `IRB-${i+1}`,
      identifikasi: ind,
      refleksi: ind.rootCauses[0] || { id: 'N/A', description: 'Perlu analisis mendalam', evidence: ind.evidence, relatedDimensionId: ind.dimensionId, relatedElementId: ind.elementId },
      benahi: ind.recommendations[0] || 'Perumusan program strategis peningkatan mutu.',
      rationale: `Karena capaian ${ind.name} masih ${ind.status} (${ind.value}), maka akar masalah ${(ind.rootCauses[0]?.description || '').toLowerCase()} harus diselesaikan agar memenuhi standar nasional.`
    }));
  }
  
  public getTopPriorities(limit: number = 10): Indicator[] {
    return this.getAllIndicators()
      .filter(i => i.gap > 0)
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, limit);
  }
}
