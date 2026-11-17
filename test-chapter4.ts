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
  const actionName = typeof action === 'string' ? action : (action.nama || action.benahi || `Program ${idx + 1}`);
  const actionRef = typeof action === 'string' ? "Indikator" : (action.kebijakanId || action.identifikasi?.name || "Rapor Pendidikan");
  const priority = priorities.find((p: any) => p.name === actionRef || p.id === actionRef || p.nama === actionRef);
  return {
    id: `OBJ-IRB-${idx + 1}`,
    strategicObjective: actionName,
    performanceIndicator: `Skor ${actionRef} Rapor Pendidikan`,
    kondisiAwal: priority ? (priority.currentScore?.toString() || priority.nilai || "0") : "0",
    targetY1: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 5).toString()) : "5",
    targetY2: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 10).toString()) : "10",
    targetY3: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 15).toString()) : "15",
    targetY4: priority ? ((Number(priority.currentScore || priority.nilai || 0) + 20).toString()) : "20",
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
    status: "synced"
  };
  
  const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
  const opActivity = OperationalPlanningMapper.fromDistribution(`OP-${rktId}`, 'PROG-IRB', distribution);
  if (assignmentResult.success && assignmentResult.assignment) {
      opActivity.planningYear = assignmentResult.assignment.planningYear;
  }
  const targetYearInt = opActivity.planningYear;
  const targetBucket = `Y${targetYearInt}`;
  
  if (!annualPlans[targetBucket as keyof typeof annualPlans]) {
      annualPlans[targetBucket as keyof typeof annualPlans] = { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] } as any;
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
const output = builder.build({
  objectives,
  annualPlans
});

console.log("=== Peta Jalan Implementasi ===");
const peta = output.sections.find(s => s.title === '4.2 Peta Jalan Implementasi');
peta?.content.forEach(c => {
  if (c.type === 'table') {
      console.log(JSON.stringify(c, null, 2));
  }
});

console.log("\n=== Rencana Kerja Tahunan (RKT) ===");
const rkt = output.sections.find(s => s.title === '4.3 Rencana Kerja Tahunan (RKT)');
rkt?.content.forEach(c => {
  if (c.type === 'table') {
      console.log(JSON.stringify(c, null, 2));
  }
});

console.log("\n=== Proyeksi Anggaran (RKAS) ===");
const rkas = output.sections.find(s => s.title === '4.4 Proyeksi Anggaran (RKAS)');
rkas?.content.forEach(c => {
  if (c.type === 'table') {
      console.log(JSON.stringify(c, null, 2));
  }
});

