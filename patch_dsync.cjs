const fs = require('fs');
let code = fs.readFileSync('src/DocumentSynchronizationEngine.ts', 'utf8');

const target = `        newObjectives.forEach((obj: any, idx: number) => {
          const program = generatedAnalysis.program[idx % generatedAnalysis.program.length] || { nama: "Program Pengembangan Kompetensi" };
          const kegiatan = generatedAnalysis.kegiatan[idx % generatedAnalysis.kegiatan.length] || { nama: "Pelatihan Berbasis Kinerja" };
          const progId = newPrograms[idx % newPrograms.length]?.id || \`PROG-\${idx}\`;
          const progName = newPrograms[idx % newPrograms.length]?.name || program.nama;
          
          const rktY1 = {
            id: \`RKT-\${String(idx + 1).padStart(3, '0')}\`,
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
          annualPlans["Y1"].rkt.push(rktY1);
          
          const rkasY1 = {
            id: \`RKAS-\${String(idx + 1).padStart(3, '0')}\`,
            rktActivityId: rktY1.id,
            activityId: rktY1.id,
            programId: progId,
            objectiveId: obj.id,
            program: progName,
            activity: kegiatan.nama,
            budgetItem: \`Biaya kegiatan \${kegiatan.nama}\`,
            accountCode: "5.1.02.01.01.0001",
            fundingSource: "BOS Reguler",
            amount: 1500000,
            status: "Draft",
            volume: "1",
            unit: "Kegiatan",
            unitPrice: 1500000,
            source: "Generated from Official Recommendation",
            generatedBy: "Tampuyak AI",
            generatedAt: Date.now()
          };
          annualPlans["Y1"].rkas.push(rkasY1);
        });
        
        annualPlans["Y1"].rkas = BudgetAllocationEngine.reallocate(annualPlans["Y1"].rkas, settings.budget);`;

const replacement = `        const distributionService = new PlanningDistributionService();
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
          annualPlans[targetYear].rkt.push(rktObj);
          
          const rkasObj = {
            id: \`RKAS-\${String(idx + 1).padStart(3, '0')}\`,
            rktActivityId: rktObj.id,
            activityId: rktObj.id,
            programId: progId,
            objectiveId: obj.id,
            program: progName,
            activity: kegiatan.nama,
            budgetItem: \`Biaya kegiatan \${kegiatan.nama}\`,
            accountCode: "5.1.02.01.01.0001",
            fundingSource: "BOS Reguler",
            amount: 1500000,
            status: "Draft",
            volume: "1",
            unit: "Kegiatan",
            unitPrice: 1500000,
            source: "Generated from Official Recommendation",
            generatedBy: "Tampuyak AI",
            generatedAt: Date.now()
          };
          annualPlans[targetYear].rkas.push(rkasObj);
        });
        
        ["Y1", "Y2", "Y3", "Y4"].forEach(year => {
           annualPlans[year].rkas = BudgetAllocationEngine.reallocate(annualPlans[year].rkas, settings.budget);
        });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/DocumentSynchronizationEngine.ts', code);
