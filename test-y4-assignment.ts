import { Chapter4Builder } from './src/DocumentCompositionEngine/builders/Chapter4Builder.ts';
import { PlanningDistributionService } from './src/planning/PlanningDistributionService.ts';
import { PlanningAssignmentService } from './src/planning/PlanningAssignmentService.ts';
import { OperationalPlanningMapper } from './src/planning/OperationalPlanningMapper.ts';
import { PlanningDistribution } from './src/planning/PlanningDistribution.ts';

const distributionService = new PlanningDistributionService();
const assignmentService = new PlanningAssignmentService();

const objectives = [
  { id: 'OBJ-IRB-1', strategicObjective: 'Program 1' }
];

const annualPlans = {
  "Y1": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
  "Y2": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
  "Y3": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
  "Y4": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }
};

objectives.forEach((obj: any, idx: number) => {
  const rktId = `RKT-MANUAL-${idx + 1}`;
  
  // MANUALLY ASSIGN PLANNING YEAR = 4
  const distribution: PlanningDistribution = {
      planningYear: 4,
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
  
  // Resolve PlanningAssignment using AssignmentService
  const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
  const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, 'PROG-IRB', distribution);
  if (assignmentResult.success && assignmentResult.assignment) {
      opActivity.planningYear = assignmentResult.assignment.planningYear;
  }
  const targetBucket = opActivity.planningYear as string;
  
  // Initialize bucket if missing
  if (!annualPlans[targetBucket as keyof typeof annualPlans]) {
      annualPlans[targetBucket as keyof typeof annualPlans] = { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] } as any;
  }
  
  if (!(annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities) {
      (annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities = [];
  }
  (annualPlans[targetBucket as keyof typeof annualPlans] as any).operationalActivities.push(opActivity);
  
  // Push components to the target bucket determined ONLY by PlanningAssignment
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
  
  annualPlans[targetBucket as keyof typeof annualPlans].monitoring.push({
    id: `MON-${targetBucket}-${idx + 1}`,
    rkasId: rkasId,
    evidence: "Daftar Hadir, Laporan Kegiatan, & Dokumentasi",
    result: "Dalam Proses"
  });
  
  annualPlans[targetBucket as keyof typeof annualPlans].evaluation.push({
    id: `EV-${targetBucket}-${idx + 1}`,
    objectiveId: obj.id,
    status: "Berjalan",
    notes: "Evaluasi dijadwalkan akhir semester."
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

