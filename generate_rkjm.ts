import { Chapter4Builder } from './src/DocumentCompositionEngine/builders/Chapter4Builder.ts';
import { PlanningDistributionService } from './src/planning/PlanningDistributionService.ts';
import { PlanningAssignmentService } from './src/planning/PlanningAssignmentService.ts';
import { OperationalPlanningMapper } from './src/planning/OperationalPlanningMapper.ts';

const distributionService = new PlanningDistributionService();
const assignmentService = new PlanningAssignmentService();

const objectives = Array.from({length: 8}, (_, i) => ({
  id: `OBJ-IRB-${i+1}`,
  strategicObjective: `Pelatihan Guru ${i+1}`,
  responsibleUnit: 'Tim Kurikulum'
}));

const annualPlans = {
  "Y1": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
  "Y2": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
  "Y3": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] },
  "Y4": { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] }
};

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
    personResponsible: "Kepala Sekolah"
  };
  
  const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
  const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, 'PROG-IRB', distribution);
  if (assignmentResult.success && assignmentResult.assignment) {
      opActivity.planningYear = assignmentResult.assignment.planningYear;
  }
  const targetBucket = opActivity.planningYear;
  
  (annualPlans[targetBucket as keyof typeof annualPlans] as any).rkt.push(rktObj);
  
  const rkasId = `RKAS-${targetBucket}-${idx + 1}a`;
  (annualPlans[targetBucket as keyof typeof annualPlans] as any).rkas.push({
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
console.log("\n=== Peta Jalan Implementasi ===\n" + JSON.stringify(peta?.tables, null, 2));

const rkt = output.sections.find(s => s.title === '4.2 Rencana Kerja Tahunan');
console.log("\n=== Rencana Kerja Tahunan ===\n" + JSON.stringify(rkt?.tables, null, 2));

const rkas = output.sections.find(s => s.title === '4.3 Proyeksi Anggaran');
console.log("\n=== Proyeksi Anggaran ===\n" + JSON.stringify(rkas?.tables, null, 2));

