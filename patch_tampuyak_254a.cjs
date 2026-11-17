const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target1 = `    // Use PlanningDistributionService to distribute activities across years
    const distributionService = new PlanningDistributionService();
    newObjectives.forEach((obj: any, idx: number) => {
      // Find a matching program for RKT
      const program = newData.program[idx % newData.program.length] || { nama: "Program Pengembangan Kompetensi" };
      const kegiatan = newData.kegiatan[idx % newData.kegiatan.length] || { nama: "Pelatihan Berbasis Kinerja" };
      
      const rktId = "RKT-Y1-GEN-" + idx;
      const targetYear = distributionService.assignYearToActivity(rktId, idx);
      
      const rktObj = {
        id: rktId,
        rkjmObjectiveId: obj.id,
        activity: program.nama,
        target: "Terlaksana dengan baik",
        status: "synced",
        // Additional derived fields
        subActivity: kegiatan.nama,
        personResponsible: obj.responsibleUnit,
        schedule: "Semester 1",
        output: "Dokumen Pelaksanaan & Bukti Karya",
        outcome: obj.performanceIndicator,
        successTarget: "100% Tercapai",
        evidence: "Daftar Hadir, Laporan, Foto",
        risk: obj.risk,
        mitigation: obj.mitigation,
        relatedSnp: obj.associatedSnp
      };
      annualPlans[targetYear].rkt.push(rktObj);`;

const replacement1 = `    // Use PlanningDistributionService to distribute activities across years
    const distributionService = new PlanningDistributionService();
    const assignmentService = new PlanningAssignmentService();
    newObjectives.forEach((obj: any, idx: number) => {
      // Find a matching program for RKT
      const program = newData.program[idx % newData.program.length] || { nama: "Program Pengembangan Kompetensi" };
      const kegiatan = newData.kegiatan[idx % newData.kegiatan.length] || { nama: "Pelatihan Berbasis Kinerja" };
      
      const rktId = "RKT-Y1-GEN-" + idx;
      
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
        activity: program.nama,
        target: "Terlaksana dengan baik",
        status: "synced",
        // Additional derived fields
        subActivity: kegiatan.nama,
        personResponsible: obj.responsibleUnit,
        schedule: "Semester 1",
        output: "Dokumen Pelaksanaan & Bukti Karya",
        outcome: obj.performanceIndicator,
        successTarget: "100% Tercapai",
        evidence: "Daftar Hadir, Laporan, Foto",
        risk: obj.risk,
        mitigation: obj.mitigation,
        relatedSnp: obj.associatedSnp
      };
      
      const assignmentResult = assignmentService.determineAssignment(rktObj, distribution, undefined, undefined, {});
      const opActivity = OperationalPlanningMapper.fromDistribution(\`OP-\${rktId}\`, program.id || 'PROG-GEN', distribution);
      if (assignmentResult.success && assignmentResult.assignment) {
          opActivity.planningYear = assignmentResult.assignment.planningYear;
      }
      
      const targetYear = opActivity.planningYear;
      if (!annualPlans[targetYear].operationalActivities) {
          annualPlans[targetYear].operationalActivities = [];
      }
      annualPlans[targetYear].operationalActivities.push(opActivity);
      
      annualPlans[targetYear].rkt.push(rktObj);`;

code = code.replace(target1, replacement1);
fs.writeFileSync('src/Tampuyak.tsx', code);
