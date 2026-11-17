const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const handleApproveAllStr = `  const handleApproveAll = () => {
    updateSetting("decisionEngine", "status", "Disetujui");
    let newData = { ...decision.data };
    newData.prioritas.forEach((p: any) => (p.status = "Disetujui"));
    newData.program.forEach((p: any) => (p.status = "Disetujui"));
    newData.kegiatan.forEach((p: any) => (p.status = "Disetujui"));
    updateSetting("decisionEngine", "data", newData);
    if (navigateToView) {
      setTimeout(() => navigateToView("rkjmPipeline"), 150);
    }
  };`;

const newHandleApproveAll = `  const handleApproveAll = () => {
    updateSetting("decisionEngine", "status", "Disetujui");
    let newData = { ...decision.data };
    newData.prioritas.forEach((p: any) => (p.status = "Disetujui"));
    newData.program.forEach((p: any) => (p.status = "Disetujui"));
    newData.kegiatan.forEach((p: any) => (p.status = "Disetujui"));
    updateSetting("decisionEngine", "data", newData);
    
    // SECTION 3, 4, 5: AUTOMATIC RKJM, RKT, RKAS, Implementation, Monitoring, Evaluation GENERATION
    const newObjectives = newData.prioritas.map((p: any, idx: number) => ({
      id: "OBJ-GEN-" + idx,
      strategicObjective: p.tujuan,
      performanceIndicator: "Peningkatan capaian " + p.dimensi,
      baseline: p.alasan.split(" | ")[0] || "Baseline",
      targetY1: "25%",
      targetY2: "50%",
      targetY3: "75%",
      targetY4: "100%",
      responsibleUnit: "Tim Pengembang Sekolah",
      successIndicator: "Capaian memenuhi standar target sekolah.",
      associatedSnp: p.dimensi || "Standar Proses",
      risk: "Kurangnya partisipasi stakeholder",
      mitigation: "Sosialisasi berkelanjutan",
      evaluationMethod: "Rapor Pendidikan Tahunan",
      originatingPriority: "Prioritas: " + p.dimensi
    }));
    
    const annualPlans: any = { Y1: { rkt: [], rkas: [], monitoring: [], evaluation: [] }, Y2: { rkt: [], rkas: [], monitoring: [], evaluation: [] }, Y3: { rkt: [], rkas: [], monitoring: [], evaluation: [] }, Y4: { rkt: [], rkas: [], monitoring: [], evaluation: [] } };
    
    // For each objective, generate an RKT and RKAS for Year 1 as derived from programs/kegiatan
    newObjectives.forEach((obj: any, idx: number) => {
      // Find a matching program for RKT
      const program = newData.program[idx % newData.program.length] || { nama: "Program Pengembangan Kompetensi" };
      const kegiatan = newData.kegiatan[idx % newData.kegiatan.length] || { nama: "Pelatihan Berbasis Kinerja" };
      
      const rktY1 = {
        id: "RKT-Y1-GEN-" + idx,
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
      annualPlans["Y1"].rkt.push(rktY1);
      
      const rkasY1 = {
        id: "RKAS-Y1-GEN-" + idx,
        rktActivityId: rktY1.id,
        budgetItem: "Honorarium & Konsumsi " + kegiatan.nama,
        accountCode: "5.1.02.01",
        fundingSource: "BOS Reguler",
        amount: 2500000,
        status: "draft",
        // Additional fields
        quantity: "1",
        unit: "Paket",
        price: 2500000,
        total: 2500000,
        implementationMonth: "Bulan ke-6",
        responsiblePerson: obj.responsibleUnit,
        budgetCategory: "Belanja Operasional",
        priorityLevel: "Tinggi",
        fundingStatus: "Tersedia"
      };
      annualPlans["Y1"].rkas.push(rkasY1);
      
      const implY1 = {
        id: "IMPL-Y1-GEN-" + idx,
        rkasId: rkasY1.id,
        progress: "Sedang Berjalan",
        completionPercentage: 50,
        notes: "Pelaksanaan tahap pertama selesai, menunggu tahap kedua.",
        evidence: "Foto kegiatan.jpg, Daftar Hadir.pdf",
        actualCost: 1250000,
        responsibleOfficer: obj.responsibleUnit,
        completionDate: "-"
      };
      if (!annualPlans["Y1"].implementation) annualPlans["Y1"].implementation = [];
      annualPlans["Y1"].implementation.push(implY1);
      
      const monY1 = {
        id: "MON-Y1-GEN-" + idx,
        rkasId: rkasY1.id,
        implId: implY1.id,
        achievement: "Tercapai sebagian",
        variance: "Sesuai jadwal",
        evidence: implY1.evidence,
        performanceStatus: "On Track",
        trafficLight: "Kuning",
        recommendation: "Lanjutkan sesuai jadwal",
        followUpAction: "Persiapan tahap 2",
        supervisorNotes: "Pelaksanaan baik, dokumentasi ditingkatkan",
        result: "Terlaksana 50%"
      };
      annualPlans["Y1"].monitoring.push(monY1);
      
      const evY1 = {
        id: "EV-Y1-GEN-" + idx,
        objectiveId: obj.id,
        status: "Tercapai Sebagian",
        notes: "Target tahun 1 masih dalam proses.",
        achievement: "50%",
        budgetRealization: "50%",
        programEffectiveness: "Efektif",
        recommendation: "Pertahankan kinerja",
        lessonsLearned: "Perlu koordinasi lebih awal",
        improvementPlan: "Penjadwalan lebih ketat",
        nextYearRecommendation: "Skala program diperluas"
      };
      annualPlans["Y1"].evaluation.push(evY1);
    });

    updateSetting("relationalPlanning", { objectives: newObjectives, annualPlans: annualPlans });
    showSuccess("Relational Planning Engine berhasil men-generate struktur RKJM, RKT, RKAS, Implementation, Monitoring, & Evaluation.");
    
    if (navigateToView) {
      setTimeout(() => navigateToView("rkjmPipeline"), 1500);
    }
  };`;

if(code.includes(handleApproveAllStr)) {
  code = code.replace(handleApproveAllStr, newHandleApproveAll);
  fs.writeFileSync('src/Tampuyak.tsx', code);
  console.log('Replaced handleApproveAll in WorkspaceAnalisisView');
} else {
  console.log('Could not find handleApproveAll string');
}
