const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target = `    objectives.forEach((obj: any, idx: number) => {
      annualPlans["Y1"].rkt.push({
        id: \`RKT-Y1-\${idx + 1}\`,
        rkjmObjectiveId: obj.id,
        activity: obj.strategicObjective,
        target: "Semua Guru & Siswa",
        status: "synced"
      });
      annualPlans["Y1"].rkas.push({
        id: \`RKAS-Y1-\${idx + 1}a\`,
        rktActivityId: \`RKT-Y1-\${idx + 1}\`,
        budgetItem: \`Biaya Pelaksanaan \${obj.strategicObjective}\`,
        accountCode: "5.1.02.01",
        fundingSource: "BOS Reguler",
        amount: 2500000,
        status: "draft"
      });
      annualPlans["Y1"].monitoring.push({
        id: \`MON-Y1-\${idx + 1}\`,
        rkasId: \`RKAS-Y1-\${idx + 1}a\`,
        evidence: "Daftar Hadir, Laporan Kegiatan, & Dokumentasi",
        result: "Dalam Proses"
      });
      annualPlans["Y1"].evaluation.push({
        id: \`EV-Y1-\${idx + 1}\`,
        objectiveId: obj.id,
        status: "Berjalan",
        notes: "Evaluasi dijadwalkan akhir semester."
      });
    });`;

const replacement = `    const distributionService = new PlanningDistributionService();
    const assignmentService = new PlanningAssignmentService();
    objectives.forEach((obj: any, idx: number) => {
      const rktId = \`RKT-Y1-\${idx + 1}\`;
      
      const targetYearStr = distributionService.assignYearToActivity(rktId, idx);
      const distribution: PlanningDistribution = {
          planningYear: parseInt(targetYearStr.replace('Y', '')),
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
      const opActivity = OperationalPlanningMapper.fromDistribution(\`OP-\${rktId}\`, 'PROG-IRB', distribution);
      if (assignmentResult.success && assignmentResult.assignment) {
          opActivity.planningYear = assignmentResult.assignment.planningYear;
      }
      const targetYear = opActivity.planningYear;
      
      if (!annualPlans[targetYear as keyof typeof annualPlans]) {
          annualPlans[targetYear as keyof typeof annualPlans] = { rkt: [], rkas: [], monitoring: [], evaluation: [], operationalActivities: [] } as any;
      }
      
      if (!(annualPlans[targetYear as keyof typeof annualPlans] as any).operationalActivities) {
          (annualPlans[targetYear as keyof typeof annualPlans] as any).operationalActivities = [];
      }
      (annualPlans[targetYear as keyof typeof annualPlans] as any).operationalActivities.push(opActivity);
      
      annualPlans[targetYear as keyof typeof annualPlans].rkt.push(rktObj);
      annualPlans[targetYear as keyof typeof annualPlans].rkas.push({
        id: \`RKAS-Y1-\${idx + 1}a\`,
        rktActivityId: rktId,
        budgetItem: \`Biaya Pelaksanaan \${obj.strategicObjective}\`,
        accountCode: "5.1.02.01",
        fundingSource: "BOS Reguler",
        amount: 2500000,
        status: "draft"
      });
      annualPlans[targetYear as keyof typeof annualPlans].monitoring.push({
        id: \`MON-Y1-\${idx + 1}\`,
        rkasId: \`RKAS-Y1-\${idx + 1}a\`,
        evidence: "Daftar Hadir, Laporan Kegiatan, & Dokumentasi",
        result: "Dalam Proses"
      });
      annualPlans[targetYear as keyof typeof annualPlans].evaluation.push({
        id: \`EV-Y1-\${idx + 1}\`,
        objectiveId: obj.id,
        status: "Berjalan",
        notes: "Evaluasi dijadwalkan akhir semester."
      });
      
      console.log(\`Activity: \${obj.strategicObjective} | PlanningAssignment.planningYear: \${targetYear} | Target annualPlans bucket: annualPlans.\${targetYear}\`);
    });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/Tampuyak.tsx', code);
