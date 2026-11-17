const fs = require('fs');
let code = fs.readFileSync('src/DocumentSynchronizationEngine.ts', 'utf8');

const target = `        const distributionService = new PlanningDistributionService();
        newObjectives.forEach((obj: any, idx: number) => {
          const program = generatedAnalysis.program[idx % generatedAnalysis.program.length] || { nama: "Program Pengembangan Kompetensi" };
          const kegiatan = generatedAnalysis.kegiatan[idx % generatedAnalysis.kegiatan.length] || { nama: "Pelatihan Berbasis Kinerja" };
          const progId = newPrograms[idx % newPrograms.length]?.id || \`PROG-\${idx}\`;
          const progName = newPrograms[idx % newPrograms.length]?.name || program.nama;
          
          const rktId = \`RKT-\${String(idx + 1).padStart(3, '0')}\`;
          const targetYear = distributionService.assignYearToActivity(rktId, idx);
          
          const rktObj = {
            id: rktId,
            rkjmObjectiveId: obj.id,
            objectiveId: obj.id,
            programId: progId,
            program: progName,
            activity: kegiatan.nama,
            target: "Terlaksana dengan baik",
            status: "Draft",
            subActivity: kegiatan.nama,
            personResponsible: obj.responsibleUnit,
            schedule: "Semester 1",
            output: "Dokumen Pelaksanaan & Bukti Karya",
            outcome: obj.performanceIndicator,
            successTarget: "100% Tercapai",
            source: "Generated from Official Recommendation",
            generatedBy: "Tampuyak AI",
            generatedAt: Date.now()
          };
          annualPlans[targetYear].rkt.push(rktObj);`;

const replacement = `        const distributionService = new PlanningDistributionService();
        const assignmentService = new PlanningAssignmentService();
        newObjectives.forEach((obj: any, idx: number) => {
          const program = generatedAnalysis.program[idx % generatedAnalysis.program.length] || { nama: "Program Pengembangan Kompetensi" };
          const kegiatan = generatedAnalysis.kegiatan[idx % generatedAnalysis.kegiatan.length] || { nama: "Pelatihan Berbasis Kinerja" };
          const progId = newPrograms[idx % newPrograms.length]?.id || \`PROG-\${idx}\`;
          const progName = newPrograms[idx % newPrograms.length]?.name || program.nama;
          
          const rktId = \`RKT-\${String(idx + 1).padStart(3, '0')}\`;
          
          // Phase 2.5.4: Consume Operational Planning Domain
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
            objectiveId: obj.id,
            programId: progId,
            program: progName,
            activity: kegiatan.nama,
            target: "Terlaksana dengan baik",
            status: "Draft",
            subActivity: kegiatan.nama,
            personResponsible: obj.responsibleUnit,
            schedule: "Semester 1",
            output: "Dokumen Pelaksanaan & Bukti Karya",
            outcome: obj.performanceIndicator,
            successTarget: "100% Tercapai",
            source: "Generated from Official Recommendation",
            generatedBy: "Tampuyak AI",
            generatedAt: Date.now()
          };
          
          const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
          const assignment = assignmentResult.success && assignmentResult.assignment ? assignmentResult.assignment : null;
          
          const opActivity = OperationalPlanningMapper.fromDistribution(\`OP-\${rktId}\`, progId, distribution);
          if (assignment) {
              opActivity.planningYear = assignment.planningYear;
          }
          
          const targetYear = opActivity.planningYear;
          
          if (!annualPlans[targetYear].operationalActivities) {
              annualPlans[targetYear].operationalActivities = [];
          }
          annualPlans[targetYear].operationalActivities.push(opActivity);
          annualPlans[targetYear].rkt.push(rktObj);`;

code = code.replace(target, replacement);
code = `import { PlanningAssignmentService } from "./planning/PlanningAssignmentService";\nimport { OperationalPlanningMapper } from "./planning/OperationalPlanningMapper";\nimport { PlanningDistribution } from "./planning/PlanningDistribution";\n` + code;
fs.writeFileSync('src/DocumentSynchronizationEngine.ts', code);
