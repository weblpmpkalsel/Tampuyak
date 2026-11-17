const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// 1. GlobalWorkflowStepper updates
code = code.replace(
  'const activeId = viewMap[currentView] || "dataSekolah";',
  'const activeId = viewMap[currentView] || (steps[currentStepIndex] ? steps[currentStepIndex].id : "dataSekolah");'
);

code = code.replace(
  '{isCompleted && !isActive ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : isActive ? <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></div>}',
  '{isCompleted ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : isActive ? <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2"></div>}'
);

// 2. DecisionEngineView handleApproveAll
const oldHandleApprove = `  const handleApproveAll = () => {
    updateSetting("decisionEngine", "status", "Disetujui");
    let newData = { ...decision.data };
    newData.prioritas.forEach((p: any) => (p.status = "Disetujui"));
    newData.program.forEach((p: any) => (p.status = "Disetujui"));
    newData.kegiatan.forEach((p: any) => (p.status = "Disetujui"));
    updateSetting("decisionEngine", "data", newData);
  };`;

const newHandleApprove = `  const handleApproveAll = () => {
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
code = code.replace(oldHandleApprove, newHandleApprove);

// 3. InsightSekolahView logic
const oldInsightRapor = `  if (!settings.rapor?.isLocked) {
    recommendations.push({
      ruleId: "RULE_002", trigger: "Rapor not locked", source: "Analisis Rapor",
      text: "Unggah dan kunci data Rapor Pendidikan terbaru.", action: () => navigateToView("rapor")
    });
    weeklyFocus.push("Analisis Rapor Pendidikan");
  } else {
    achievements.push("Rapor Pendidikan berhasil dikunci.");
    
    // Check Numerasi/Literasi
    const dimNumerasi = settings.rapor.data && settings.rapor.data["A.2"];
    if (dimNumerasi && dimNumerasi.nilai && parseFloat(dimNumerasi.nilai) < 70) {
      recommendations.push({
        ruleId: "RULE_002B", trigger: "Numerasi < 70", source: "Analisis Rapor",
        text: "Skor Numerasi menurun/rendah. Kami menyarankan penguatan program literasi dan numerasi di RKT.", action: () => navigateToView("diagnosis")
      });
    }
  }

  // RKJM Rule
  if (!rkjmDoc) {
    if (settings.rapor?.isLocked) {
      recommendations.push({
        ruleId: "RULE_003", trigger: "RKJM missing", source: "Perencanaan",
        text: "Mulai penyusunan Rencana Kerja Jangka Menengah (RKJM).", action: () => navigateToView("rkjmPipeline")
      });
      weeklyFocus.push("Susun Dokumen RKJM");
    }
  }`;

const newInsightRapor = `  if (!settings.rapor?.isLocked) {
    recommendations.push({
      ruleId: "RULE_002", trigger: "Rapor not locked", source: "Analisis Rapor",
      text: "Unggah dan kunci data Rapor Pendidikan terbaru.", action: () => navigateToView("rapor")
    });
    weeklyFocus.push("Analisis Rapor Pendidikan");
  } else if (settings.decisionEngine?.status !== "Disetujui") {
    recommendations.push({
      ruleId: "RULE_002B", trigger: "Decision not approved", source: "Analisis Prioritas",
      text: "Lakukan Analisis Prioritas untuk menentukan rekomendasi program.", action: () => navigateToView("diagnosis")
    });
    risks.push({
      ruleId: "RISK_002", title: "Analisis Prioritas Belum Disetujui", impact: "Penyusunan RKJM tidak dapat dilakukan secara akurat.",
      actionText: "Mulai Analisis", action: () => navigateToView("diagnosis")
    });
    weeklyFocus.push("Analisis Prioritas");
  } else {
    achievements.push("Rapor Pendidikan berhasil dikunci.");
    achievements.push("Analisis Prioritas telah disetujui.");
    
    // Check Numerasi/Literasi
    const dimNumerasi = settings.rapor.data && settings.rapor.data["A.2"];
    if (dimNumerasi && dimNumerasi.nilai && parseFloat(dimNumerasi.nilai) < 70) {
      recommendations.push({
        ruleId: "RULE_002C", trigger: "Numerasi < 70", source: "Analisis Rapor",
        text: "Skor Numerasi menurun/rendah. Kami menyarankan penguatan program literasi dan numerasi di RKT.", action: () => navigateToView("diagnosis")
      });
    }
  }

  // RKJM Rule
  if (!rkjmDoc) {
    if (settings.decisionEngine?.status === "Disetujui") {
      recommendations.push({
        ruleId: "RULE_003", trigger: "RKJM missing", source: "Perencanaan",
        text: "Mulai penyusunan Rencana Kerja Jangka Menengah (RKJM).", action: () => navigateToView("rkjmPipeline")
      });
      weeklyFocus.push("Susun Dokumen RKJM");
    }
  }`;
code = code.replace(oldInsightRapor, newInsightRapor);

// 4. GovernanceComplianceView
const oldGovernanceRKJM = `  if (!rkjmDoc) {
    addFinding("Critical", "RKJM Tidak Ditemukan", "Rencana Kerja Jangka Menengah wajib ada sebagai dasar perencanaan.", "COMP_004", "Missing RKJM", "Perencanaan", "Buat RKJM", () => navigateToView("rkjmPipeline"));
  } else if (rkjmDoc.status !== "Disetujui" && rkjmDoc.status !== "Terkunci") {`;

const newGovernanceRKJM = `  if (!rkjmDoc) {
    if (settings.decisionEngine?.status !== "Disetujui") {
      addFinding("High", "Analisis Prioritas Belum Disetujui", "Dokumen RKJM membutuhkan dasar Analisis Prioritas.", "COMP_003B", "Decision not approved", "Perencanaan", "Buat Analisis", () => navigateToView("diagnosis"));
    } else {
      addFinding("Critical", "RKJM Tidak Ditemukan", "Rencana Kerja Jangka Menengah wajib ada sebagai dasar perencanaan.", "COMP_004", "Missing RKJM", "Perencanaan", "Buat RKJM", () => navigateToView("rkjmPipeline"));
    }
  } else if (rkjmDoc.status !== "Disetujui" && rkjmDoc.status !== "Terkunci") {`;
code = code.replace(oldGovernanceRKJM, newGovernanceRKJM);

// 5. ProductionReadinessView workflow check
const oldWorkflowComplete = `  const isWorkflowComplete = rkjmDoc?.status === "Disetujui" && rktDoc?.status === "Disetujui" && rkasDoc?.status === "Disetujui";`;
const newWorkflowComplete = `  const isAnalisisApproved = settings.decisionEngine?.status === "Disetujui";
  const isWorkflowComplete = isAnalisisApproved && rkjmDoc?.status === "Disetujui" && rktDoc?.status === "Disetujui" && rkasDoc?.status === "Disetujui";`;
code = code.replace(oldWorkflowComplete, newWorkflowComplete);


fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Fixed workflow sync');
