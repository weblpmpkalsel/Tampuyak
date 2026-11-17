const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target2 = `    const distributionService = new PlanningDistributionService();
    objectives.forEach((obj: any, idx: number) => {
      const rktId = \`RKT-Y1-\${idx + 1}\`;
      const targetYear = distributionService.assignYearToActivity(rktId, idx);
      
      annualPlans[targetYear].rkt.push({
        id: rktId,
        rkjmObjectiveId: obj.id,
        activity: obj.strategicObjective,
        target: "Semua Guru & Siswa",
        status: "synced"
      });`;

const replacement2 = `    const distributionService = new PlanningDistributionService();
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
      const opActivity = OperationalPlanningMapper.fromDistribution(\`OP-\${rktId}\`, 'PROG-MANUAL', distribution);
      if (assignmentResult.success && assignmentResult.assignment) {
          opActivity.planningYear = assignmentResult.assignment.planningYear;
      }
      const targetYear = opActivity.planningYear;
      
      if (!annualPlans[targetYear].operationalActivities) {
          annualPlans[targetYear].operationalActivities = [];
      }
      annualPlans[targetYear].operationalActivities.push(opActivity);
      
      annualPlans[targetYear].rkt.push(rktObj);`;

code = code.replace(target2, replacement2);
code = `import { PlanningAssignmentService } from "./planning/PlanningAssignmentService";\nimport { OperationalPlanningMapper } from "./planning/OperationalPlanningMapper";\nimport { PlanningDistribution } from "./planning/PlanningDistribution";\n` + code;
fs.writeFileSync('src/Tampuyak.tsx', code);
