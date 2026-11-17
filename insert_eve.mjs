import fs from 'fs';
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const eveEngine = `
const EnterpriseValidationEngine = {
  validateSystem: (settings: any) => {
    const traces: any[] = [];
    
    const hasName = !!settings.school?.name && settings.school?.name !== "";
    const hasNpsn = !!settings.school?.npsn && settings.school?.npsn !== "";
    traces.push({
      id: "school_identity",
      requirement: "Identitas Sekolah",
      sourceModule: "Data Master Sekolah",
      hasData: hasName && hasNpsn,
      status: (hasName && hasNpsn) ? "PASS" : "BLOCKED",
      reason: (hasName && hasNpsn) ? "Identitas dasar terisi." : "Nama sekolah dan NPSN wajib diisi.",
      fixAction: "Lengkapi data sekolah pada tab Profil.",
      fixPath: "dataSekolah"
    });

    const hasPrincipal = !!settings.principal?.name && settings.principal?.name !== "";
    traces.push({
      id: "school_principal",
      requirement: "Kepala Sekolah",
      sourceModule: "Data Master Sekolah",
      hasData: hasPrincipal,
      status: hasPrincipal ? "PASS" : "BLOCKED",
      reason: hasPrincipal ? "Profil Kepala Sekolah terisi." : "Data Kepala Sekolah wajib ada untuk pengesahan dokumen.",
      fixAction: "Lengkapi data Kepala Sekolah.",
      fixPath: "dataSekolah"
    });

    const hasVisi = !!settings.identitas?.visi && settings.identitas?.visi !== "";
    traces.push({
      id: "school_visi",
      requirement: "Visi & Misi",
      sourceModule: "Data Master Sekolah",
      hasData: hasVisi,
      status: hasVisi ? "PASS" : "BLOCKED",
      reason: hasVisi ? "Visi Misi terisi." : "Sekolah belum menentukan visi dan misi.",
      fixAction: "Lengkapi visi dan misi.",
      fixPath: "dataSekolah"
    });

    const isRaporLocked = !!settings.rapor?.isLocked;
    traces.push({
      id: "rapor_locked",
      requirement: "Data Rapor Pendidikan",
      sourceModule: "Rapor Pendidikan",
      hasData: isRaporLocked,
      status: isRaporLocked ? "PASS" : "BLOCKED",
      reason: isRaporLocked ? "Rapor disinkronisasi." : "Data Rapor Pendidikan belum disinkronisasi atau dikunci.",
      fixAction: "Lakukan sinkronisasi Rapor Pendidikan.",
      fixPath: "rapor"
    });

    const isAnalisisApproved = settings.decisionEngine?.status === "Disetujui" || settings.analisis?.status === "Selesai" || settings.analisis?.status === "Terkunci";
    traces.push({
      id: "analisis_approved",
      requirement: "Analisis Prioritas (SWOT & IRB)",
      sourceModule: "Perencanaan > Analisis",
      hasData: isAnalisisApproved,
      status: isAnalisisApproved ? "PASS" : "BLOCKED",
      reason: isAnalisisApproved ? "Analisis telah disetujui." : "Analisis Akar Masalah dan Prioritas belum selesai/disetujui.",
      fixAction: "Selesaikan dan setujui Analisis Prioritas.",
      fixPath: "diagnosis"
    });

    const hasRkjmObjectives = settings.planning?.rkjm && settings.planning.rkjm.length > 0;
    traces.push({
      id: "rkjm_objectives",
      requirement: "Sasaran Strategis RKJM",
      sourceModule: "Perencanaan > RKJM",
      hasData: hasRkjmObjectives,
      status: hasRkjmObjectives ? "PASS" : "BLOCKED",
      reason: hasRkjmObjectives ? "Sasaran strategis RKJM telah disusun." : "Belum ada program strategis yang disusun.",
      fixAction: "Susun program kerja di menu RKJM.",
      fixPath: "rkjmPipeline"
    });

    const isRkjmApproved = settings.documents?.find((d: any) => d.type === "RKJM")?.status === "Disetujui" || settings.documents?.find((d: any) => d.type === "RKJM")?.status === "Final";
    traces.push({
      id: "rkjm_approved",
      requirement: "Dokumen RKJM Disetujui",
      sourceModule: "Perencanaan > RKJM",
      hasData: isRkjmApproved,
      status: isRkjmApproved ? "PASS" : "BLOCKED",
      reason: isRkjmApproved ? "Dokumen RKJM siap diturunkan." : "Dokumen RKJM belum mencapai status Disetujui.",
      fixAction: "Setujui dokumen RKJM sebelum menyusun RKT.",
      fixPath: "dokumenPerencanaan"
    });

    const hasRktActivities = settings.planning?.rkt && settings.planning.rkt.length > 0;
    traces.push({
      id: "rkt_activities",
      requirement: "Kegiatan Tahunan RKT",
      sourceModule: "Perencanaan > RKT",
      hasData: hasRktActivities,
      status: hasRktActivities ? "PASS" : "BLOCKED",
      reason: hasRktActivities ? "Kegiatan tahunan telah disusun." : "Belum ada penjabaran kegiatan untuk tahun berjalan.",
      fixAction: "Turunkan RKT dari RKJM.",
      fixPath: "rktDerivation"
    });

    const isRktApproved = settings.documents?.find((d: any) => d.type === "RKT")?.status === "Disetujui" || settings.documents?.find((d: any) => d.type === "RKT")?.status === "Final";
    traces.push({
      id: "rkt_approved",
      requirement: "Dokumen RKT Disetujui",
      sourceModule: "Perencanaan > RKT",
      hasData: isRktApproved,
      status: isRktApproved ? "PASS" : "BLOCKED",
      reason: isRktApproved ? "Dokumen RKT siap diturunkan ke RKAS." : "Dokumen RKT belum mencapai status Disetujui.",
      fixAction: "Setujui dokumen RKT sebelum menyusun RKAS.",
      fixPath: "dokumenPerencanaan"
    });

    const hasRkasBudget = settings.planning?.rkas && settings.planning.rkas.length > 0;
    traces.push({
      id: "rkas_budget",
      requirement: "Pemetaan Anggaran RKAS",
      sourceModule: "Perencanaan > RKAS",
      hasData: hasRkasBudget,
      status: hasRkasBudget ? "PASS" : "BLOCKED",
      reason: hasRkasBudget ? "Pembiayaan telah diestimasikan." : "Belum ada rincian pembiayaan kegiatan.",
      fixAction: "Susun pemetaan anggaran di menu RKAS.",
      fixPath: "rkasDerivation"
    });

    const isRkasApproved = settings.documents?.find((d: any) => d.type === "RKAS")?.status === "Disetujui" || settings.documents?.find((d: any) => d.type === "RKAS")?.status === "Final";
    traces.push({
      id: "rkas_approved",
      requirement: "Dokumen RKAS Disetujui",
      sourceModule: "Perencanaan > RKAS",
      hasData: isRkasApproved,
      status: isRkasApproved ? "PASS" : "BLOCKED",
      reason: isRkasApproved ? "RKAS telah disetujui untuk dilaksanakan." : "Dokumen RKAS belum mencapai status Disetujui.",
      fixAction: "Setujui dokumen RKAS untuk dimonitoring.",
      fixPath: "dokumenPerencanaan"
    });

    const passed = traces.filter(t => t.status === "PASS").length;
    const score = Math.round((passed / traces.length) * 100);
    const overallStatus = traces.every(t => t.status === "PASS") ? "PASS" : "BLOCKED";

    return { score, traces, overallStatus };
  },

  validateDocument: (docId: string, settings: any) => {
    const system = EnterpriseValidationEngine.validateSystem(settings);
    const traces = system.traces;
    const findStatus = (id: string) => traces.find((t: any) => t.id === id);

    const getCoverage = (dependencies: string[]) => {
      const deps = dependencies.map(id => findStatus(id)).filter(Boolean);
      const passed = deps.filter((d: any) => d.status === "PASS").length;
      if (deps.length === 0) return { coverage: 0, status: "BLOCKED", missing: [] };
      const missing = deps.filter((d: any) => d.status !== "PASS").map((d: any) => ({
        dataset: d.requirement,
        module: d.sourceModule,
        link: d.fixPath,
        action: d.fixAction
      }));
      const coverage = Math.round((passed / deps.length) * 100);
      const status = coverage === 100 ? "PASS" : (coverage > 0 ? "Sebagian" : "Blocked");
      return { coverage, status, missing };
    };

    let chapters: any[] = [];
    if (docId === "ksp") {
      const b1 = getCoverage(["school_identity", "rapor_locked"]);
      const b2 = getCoverage(["school_identity", "school_visi"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Karakteristik Satuan Pendidikan", sources: ["Data Master Sekolah", "Rapor Pendidikan"], module: "Pengaturan & Rapor", stage: "Analisis Karakteristik", regulation: "Permendikbud No. 12 Tahun 2024", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Visi, Misi, dan Tujuan", sources: ["Data Master Sekolah"], module: "Pengaturan", stage: "Perumusan Visi Misi", regulation: "Permendikbud No. 12 Tahun 2024", coverage: b2.coverage, missing: b2.missing, status: b2.status }
      ];
    } else if (docId === "rkjm") {
      const b1 = getCoverage(["school_identity"]);
      const b2 = getCoverage(["rapor_locked"]);
      const b3 = getCoverage(["analisis_approved", "rkjm_objectives"]);
      const b4 = getCoverage(["analisis_approved", "rkjm_objectives"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["Data Master Sekolah", "Visi Misi"], module: "Pengaturan & KSP", stage: "Persiapan RKJM", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Analisis Kondisi", sources: ["Rapor Pendidikan"], module: "Rapor Pendidikan", stage: "Evaluasi Diri Sekolah", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b2.coverage, missing: b2.missing, status: b2.status },
        { id: "bab3", chapter: "BAB III: Program Kerja Strategis", sources: ["Analisis Prioritas (SWOT)", "Sasaran Strategis"], module: "Perencanaan > Analisis", stage: "Perumusan Program Strategis", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b3.coverage, missing: b3.missing, status: b3.status },
        { id: "bab4", chapter: "BAB IV: Rencana Pembiayaan", sources: ["Analisis Prioritas (SWOT)", "Sasaran Strategis"], module: "Perencanaan > Analisis", stage: "Estimasi Pembiayaan Jangka Menengah", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b4.coverage, missing: b4.missing, status: b4.status },
        { id: "appendix", chapter: "LAMPIRAN", sources: ["Aset Dokumen", "Bukti Fisik"], module: "Lampiran", stage: "Kelengkapan Fisik", regulation: "Administrasi Sekolah", coverage: 100, missing: [], status: "PASS" }
      ];
    } else if (docId === "rkt") {
      const b1 = getCoverage(["rkjm_approved"]);
      const b2 = getCoverage(["rkjm_approved", "rkt_activities"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["RKJM Disetujui", "Data Master Sekolah"], module: "RKJM", stage: "Persiapan RKT", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Program dan Kegiatan Tahunan", sources: ["RKJM Disetujui", "Sasaran Strategis Tahunan"], module: "RKJM", stage: "Penjabaran Program Tahunan", regulation: "Permendikdasmen No. 47 Tahun 2023", coverage: b2.coverage, missing: b2.missing, status: b2.status }
      ];
    } else if (docId === "rkas") {
      const b1 = getCoverage(["rkt_approved"]);
      const b2 = getCoverage(["rkt_approved", "rkas_budget"]);
      chapters = [
        { id: "bab1", chapter: "BAB I: Pendahuluan", sources: ["RKT Disetujui"], module: "RKT", stage: "Persiapan RKAS", regulation: "Permendikdasmen No. 63 Tahun 2022", coverage: b1.coverage, missing: b1.missing, status: b1.status },
        { id: "bab2", chapter: "BAB II: Rincian Anggaran Pendapatan dan Belanja", sources: ["RKT Disetujui", "Standar Biaya"], module: "RKT", stage: "Pemetaan Kode Rekening", regulation: "Permendikdasmen No. 63 Tahun 2022", coverage: b2.coverage, missing: b2.missing, status: b2.status }
      ];
    } else if (docId === "monitoring") {
      const b1 = getCoverage(["rkas_approved"]);
      chapters = [
        { id: "bab1", chapter: "Laporan Pelaksanaan", sources: ["RKAS Disetujui", "Implementasi"], module: "RKAS", stage: "Pelaksanaan", regulation: "Standar Pengelolaan", coverage: b1.coverage, missing: b1.missing, status: b1.status }
      ];
    } else if (docId === "evaluasi") {
      const b1 = getCoverage(["rkas_approved"]); 
      chapters = [
        { id: "bab1", chapter: "Evaluasi Kinerja", sources: ["Monitoring Disetujui", "Laporan Capaian"], module: "Monitoring", stage: "Evaluasi", regulation: "Standar Penilaian", coverage: b1.coverage, missing: b1.missing, status: b1.status }
      ];
    }

    const overallStatus = chapters.every(c => c.status === "PASS") ? "PASS" : "BLOCKED";
    const totalCoverage = chapters.length > 0 ? chapters.reduce((a, b) => a + b.coverage, 0) / chapters.length : 0;
    
    const errors: string[] = [];
    chapters.forEach(c => {
       c.missing.forEach((m: any) => {
          const msg = \`\${c.chapter} belum dapat disusun. Yang masih harus dilengkapi: \${m.dataset}. \${m.action}\`;
          if (!errors.includes(msg)) errors.push(msg);
       });
    });

    const valid = overallStatus === "PASS";

    // Adding document specific checks (from original PrePrintValidationEngine)
    const docMeta = settings.documents?.find((d: any) => d.id === docId);
    if (!docMeta) {
      errors.push("Dokumen tidak ditemukan");
    } else {
      if (docMeta.status !== "Disetujui" && docMeta.status !== "Terkunci" && docMeta.status !== "Siap Dicetak" && docMeta.status !== "Final") {
         errors.push(\`Status dokumen saat ini adalah \${docMeta.status}. Dokumen harus disetujui sebelum dicetak.\`);
      }
      if (settings.metadata?.versionFreeze && docMeta.status === "Draf") {
         errors.push("Sistem dalam mode Version Freeze. Tidak bisa mencetak draft.");
      }
    }

    return { overallStatus, totalCoverage, chapters, errors, valid: errors.length === 0, systemTraces: system.traces };
  }
};
`

// Replace PrePrintValidationEngine
content = content.replace(/const PrePrintValidationEngine = \{[\s\S]*?\};\n/, eveEngine + '\n');
fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Injected EnterpriseValidationEngine');
