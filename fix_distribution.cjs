const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /objectives\.forEach\(\(obj: any, idx: number\) => \{([\s\S]*?)console\.log\([^)]+\);\n    \}\);/;
const match = code.match(regex);
if (match) {
  const replacement = `objectives.forEach((obj: any, idx: number) => {
      // RKJM is a 4-year cycle. Generate operational activities for ALL 4 years for each objective.
      [1, 2, 3, 4].forEach(yearInt => {
        const distYearStr = \`Y\${yearInt}\`;
        const rktId = \`RKT-\${distYearStr}-\${idx + 1}\`;
        
        const distribution: PlanningDistribution = {
            planningYear: yearInt,
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
        
        // Resolve PlanningAssignment using AssignmentService
        const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
        const opActivity = OperationalPlanningMapper.fromDistribution(\`OP-\${rktId}\`, 'PROG-IRB', distribution);
        if (assignmentResult.success && assignmentResult.assignment) {
            opActivity.planningYear = assignmentResult.assignment.planningYear;
        }
        const targetBucket = opActivity.planningYear as string;
        const targetYearInt = parseInt(targetBucket.replace('Y', ''));
        
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
        
        const rkasId = \`RKAS-\${targetBucket}-\${idx + 1}a\`;
        annualPlans[targetBucket as keyof typeof annualPlans].rkas.push({
          id: rkasId,
          rktActivityId: rktId,
          budgetItem: \`Biaya Pelaksanaan \${obj.strategicObjective} (Tahun \${yearInt})\`,
          accountCode: "5.1.02.01",
          fundingSource: "BOS Reguler",
          amount: 2500000,
          status: "draft"
        });
        
        annualPlans[targetBucket as keyof typeof annualPlans].monitoring.push({
          id: \`MON-\${targetBucket}-\${idx + 1}\`,
          rkasId: rkasId,
          evidence: "Daftar Hadir, Laporan Kegiatan, & Dokumentasi",
          result: "Dalam Proses"
        });
        
        annualPlans[targetBucket as keyof typeof annualPlans].evaluation.push({
          id: \`EV-\${targetBucket}-\${idx + 1}\`,
          objectiveId: obj.id,
          status: "Berjalan",
          notes: "Evaluasi dijadwalkan akhir semester."
        });
        console.log(\`Activity: \${obj.strategicObjective} | PlanningAssignment.planningYear: \${targetYearInt} | Target annualPlans bucket: annualPlans.\${targetBucket}\`);
      });
    });`;
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log("Replaced successfully");
} else {
  console.log("Target not found!");
}
