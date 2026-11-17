import { Chapter4Builder } from './src/DocumentCompositionEngine/builders/Chapter4Builder.ts';
import { PlanningDistributionService } from './src/planning/PlanningDistributionService.ts';
import { PlanningAssignmentService } from './src/planning/PlanningAssignmentService.ts';
import { OperationalPlanningMapper } from './src/planning/OperationalPlanningMapper.ts';
import { PlanningDistribution } from './src/planning/PlanningDistribution.ts';

const distributionService = new PlanningDistributionService();
const assignmentService = new PlanningAssignmentService();

// Mock actual analysis data
const analysisData = {
  program: [
    { nama: "Peningkatan Kompetensi Literasi", kebijakanId: "Literasi" },
    { nama: "Peningkatan Kompetensi Numerasi", kebijakanId: "Numerasi" }
  ],
  prioritas: [
    { name: "Literasi", currentScore: 50 },
    { name: "Numerasi", currentScore: 40 }
  ]
};

const irb = analysisData.program;
const priorities = analysisData.prioritas;

const objectives = irb.map((action: any, idx: number) => {
  const actionName = action.nama;
  const actionRef = action.kebijakanId;
  const priority = priorities.find((p: any) => p.name === actionRef);
  return {
    id: `OBJ-IRB-${idx + 1}`,
    strategicObjective: actionName,
    performanceIndicator: `Skor ${actionRef} Rapor Pendidikan`,
    kondisiAwal: priority ? priority.currentScore.toString() : "0",
    targetY1: priority ? (priority.currentScore + 5).toString() : "5",
    targetY2: priority ? (priority.currentScore + 10).toString() : "10",
    targetY3: priority ? (priority.currentScore + 15).toString() : "15",
    targetY4: priority ? (priority.currentScore + 20).toString() : "20",
    responsibleUnit: "Tim Kurikulum",
    successIndicator: "Implementasi 100%",
    associatedSnp: "Standar Proses / Penilaian",
    risk: "Keterbatasan waktu pendidik",
    mitigation: "Optimalisasi Komunitas Belajar (Kombel)",
    evaluationMethod: "Observasi & Rapor Pendidikan",
    originatingPriority: `Hasil Analisis (${actionRef})`
  };
});

const annualPlans = {
  "Y1": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] },
  "Y2": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] },
  "Y3": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] },
  "Y4": { rkt: [] as any[], rkas: [] as any[], monitoring: [] as any[], evaluation: [] as any[], operationalActivities: [] as any[] }
};

objectives.forEach((obj: any, idx: number) => {
  // MANUALLY ASSIGN YEAR 4 FOR THE FIRST ACTIVITY
  const distYearStr = idx === 0 ? 'Y4' : distributionService.assignYearToActivity(`RKT-GEN-${idx}`, idx);
  const rktId = `RKT-${distYearStr}-${idx + 1}`;
  
  const distribution: PlanningDistribution = {
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
    personResponsible: "Kepala Sekolah"
  };
  
  const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
  const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, 'PROG-IRB', distribution);
  if (assignmentResult.success && assignmentResult.assignment) {
      opActivity.planningYear = assignmentResult.assignment.planningYear;
  }
  const targetBucket = opActivity.planningYear as string;
  
  if (!annualPlans[targetBucket as keyof typeof annualPlans]) {
      (annualPlans as any)[targetBucket] = { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] };
  }
  if (!(annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities) {
      (annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities = [];
  }
  (annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities.push(opActivity);
  
  annualPlans[targetBucket as keyof typeof annualPlans].rkt.push(rktObj);
  
  const rkasId = `RKAS-${targetBucket}-${idx + 1}a`;
  annualPlans[targetBucket as keyof typeof annualPlans].rkas.push({
    id: rkasId,
    rktActivityId: rktId,
    budgetItem: `Biaya Pelaksanaan ${obj.strategicObjective}`,
    accountCode: "5.1.02.01",
    fundingSource: "BOS Reguler",
    amount: 2500000,
    status: "draft"
  });
});

const builder = new Chapter4Builder();
const output = builder.build({} as any, { relationalPlanning: { objectives, annualPlans } });

const peta = output.sections.find(s => s.title === '4.1 Peta Jalan Implementasi');
console.log("=== 4.1 Peta Jalan Implementasi ===");
console.log(JSON.stringify(peta?.tables, null, 2));

const rkt = output.sections.find(s => s.title === '4.2 Rencana Kerja Tahunan');
console.log("\n=== 4.2 Rencana Kerja Tahunan ===");
console.log(JSON.stringify(rkt?.tables, null, 2));

const rkas = output.sections.find(s => s.title === '4.3 Proyeksi Anggaran');
console.log("\n=== 4.3 Proyeksi Anggaran ===");
console.log(JSON.stringify(rkas?.tables, null, 2));

