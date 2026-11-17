import { Chapter4Builder } from './src/DocumentCompositionEngine/builders/Chapter4Builder.ts';
import { PlanningDistributionService } from './src/planning/PlanningDistributionService.ts';
import { PlanningAssignmentService } from './src/planning/PlanningAssignmentService.ts';
import { OperationalPlanningMapper } from './src/planning/OperationalPlanningMapper.ts';

const settings = {
  analisis: {
    data: {
      program: [
        { id: '1', nama: 'Program 1' },
        { id: '2', nama: 'Program 2' },
        { id: '3', nama: 'Program 3' },
        { id: '4', nama: 'Program 4' },
        { id: '5', nama: 'Program 5' }
      ],
      prioritas: []
    }
  }
};

const analysisData = settings.analisis?.data || {};
const irb = analysisData.program || [];
const priorities = analysisData.prioritas || [];
const objectives = irb.map((action: any, idx: number) => {
  return {
    id: `OBJ-IRB-${idx + 1}`,
    strategicObjective: `Program ${idx + 1}`,
    performanceIndicator: `Skor Rapor Pendidikan`,
    kondisiAwal: "0",
    targetY1: "5",
    targetY2: "10",
    targetY3: "15",
    targetY4: "20",
    responsibleUnit: "Tim Kurikulum",
    successIndicator: "Implementasi 100%",
    associatedSnp: "Standar Proses / Penilaian",
    risk: "Keterbatasan waktu pendidik",
    mitigation: "Optimalisasi Komunitas Belajar (Kombel)",
    evaluationMethod: "Observasi & Rapor Pendidikan",
    originatingPriority: `Hasil Analisis`
  };
});

const annualPlans = {
  "Y1": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[] },
  "Y2": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[] },
  "Y3": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[] },
  "Y4": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[] }
};

const distributionService = new PlanningDistributionService();
const assignmentService = new PlanningAssignmentService();

objectives.forEach((obj: any, idx: number) => {
  const distYearStr = distributionService.assignYearToActivity(`RKT-GEN-${idx}`, idx);
  const rktId = `RKT-${distYearStr}-${idx + 1}`;
  
  const distribution: any = {
      planningYear: parseInt(distYearStr.replace('Y', '')),
      activityReferenceId: rktId,
      priorityOrder: 1,
      dependencyReferences: [],
      recommendedQuarter: 1,
      recommendedSemester: 1,
      recommendedSequence: 1
  };
  
  const rktObj = {
    id: rktId,
    rkjmObjectiveId: obj.id,
    activity: obj.strategicObjective,
    target: "Semua Guru & Siswa",
    status: "synced",
    _assignedYear: distYearStr // IMPORTANT: added by Chapter4Builder implicitly if missing? No, the builder might rely on something.
  };
  
  const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
  const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, 'PROG-IRB', distribution);
  if (assignmentResult.success && assignmentResult.assignment) {
      opActivity.planningYear = assignmentResult.assignment.planningYear;
  }
  const targetYearInt = opActivity.planningYear;
  const targetBucket = `Y${targetYearInt}`;
  
  annualPlans[targetBucket as keyof typeof annualPlans].rkt.push(rktObj);
  
  const rkasId = `RKAS-${targetBucket}-${idx + 1}a`;
  annualPlans[targetBucket as keyof typeof annualPlans].rkas.push({
    id: rkasId,
    rktActivityId: rktId,
    budgetItem: `Biaya Pelaksanaan ${obj.strategicObjective}`,
    accountCode: "5.1.02.01",
    fundingSource: "BOS Reguler",
    amount: 2500000,
    status: "draft",
    _assignedYear: targetBucket
  });
});

const builder = new Chapter4Builder();
const output = builder.build({
  objectives,
  annualPlans
});

console.log(JSON.stringify(output.sections, null, 2));

