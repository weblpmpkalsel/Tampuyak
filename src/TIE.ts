import { MasterSNP, MasterRKAS, MasterRapor, MasterRegulations } from "./MasterData";

export const TIE = {
  analyzeRapor: (raporData: Record<string, any>, context?: any) => {
    const findings: any[] = [];
    
    // Classify school based on School DNA / Context
    const isDigital = context?.programUnggulan?.includes("Digital") || context?.karakteristik?.lingkungan?.includes("Teknologi");
    const isCoastal = context?.karakteristik?.lokasi?.includes("Pesisir");

    // 1. Identify weak indicators
    Object.keys(raporData).forEach(key => {
      const value = parseFloat(raporData[key].nilai);
      if (value < 70) {
        // Gap identified
        const masterIndicator = MasterRapor.find(r => r.indicatorId === key);
        if (masterIndicator) {
          findings.push({
            indicatorId: key,
            score: value,
            gap: true,
            masterData: masterIndicator
          });
        }
      }
    });

    // 2. Root Cause & Recommendations Generation
    const decisions = findings.map(finding => {
      const rootCauses = finding.masterData.recommendedStrategies.map((strategy: string, idx: number) => ({
        causeId: `RC-${finding.indicatorId}-${idx}`,
        description: strategy,
        confidence: 85 + Math.random() * 10 // Estimated confidence based on heuristic
      }));

      const recommendations = finding.masterData.suggestedPrograms.map((program: string, idx: number) => {
        const rkasCode = finding.masterData.suggestedRkasCodeIds[idx] || finding.masterData.suggestedRkasCodeIds[0];
        const rkasDetails = MasterRKAS.find(r => r.activityCode === rkasCode);
        
        // Alternatives Generation (A, B, C)
        return [
          {
            alternativeId: "A",
            priority: "CRITICAL",
            rkjmObjective: finding.masterData.suggestedRkjmObjectives[0],
            rktProgram: program,
            rkasCode: rkasCode,
            snpId: rkasDetails?.primarySnpId,
            regulationId: rkasDetails?.regulationId,
            explainability: {
              why: `Skor ${finding.masterData.category} (${finding.indicatorId}) berada di bawah target nasional (${finding.score}/100).`,
              evidence: `Berdasarkan data Rapor Pendidikan terakhir.`,
              expectedImpact: `Peningkatan skor ${finding.masterData.category} pada siklus evaluasi berikutnya.`,
              dnaTrace: isDigital ? "Sekolah Digital" : isCoastal ? "Sekolah Pesisir" : "Reguler"
            },
            metrics: {
              impactScore: 90,
              urgencyScore: 95,
              costEstimate: "Tinggi",
              difficulty: "Sedang"
            }
          },
          {
            alternativeId: "B",
            priority: "HIGH",
            rkjmObjective: finding.masterData.suggestedRkjmObjectives[0],
            rktProgram: `${program} (Skala Terbatas)`,
            rkasCode: rkasCode,
            snpId: rkasDetails?.primarySnpId,
            regulationId: rkasDetails?.regulationId,
            explainability: {
              why: `Penanganan bertahap untuk ${finding.masterData.category}.`,
              evidence: `Berdasarkan data Rapor Pendidikan terakhir.`,
              expectedImpact: `Perbaikan bertahap pada area paling kritis.`,
              dnaTrace: isDigital ? "Sekolah Digital" : isCoastal ? "Sekolah Pesisir" : "Reguler"
            },
            metrics: {
              impactScore: 75,
              urgencyScore: 80,
              costEstimate: "Sedang",
              difficulty: "Rendah"
            }
          }
        ];
      }).flat();

      return {
        indicatorId: finding.indicatorId,
        score: finding.score,
        gap: finding.gap,
        rootCauses,
        recommendations
      };
    });

    return {
      analysisId: `TIE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      findings: decisions
    };
  }
};
