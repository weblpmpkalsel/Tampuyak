export class CurriculumAdapter {
  static normalize(curriculum: any) {
    if (!curriculum) return {};
    return {
      learningLoad: curriculum.learningLoad,
      learningOrganization: curriculum.learningOrganization,
      intracurricular: curriculum.intracurricular,
      cocurricular: curriculum.cocurricular,
      extracurricular: curriculum.extracurricular,
      academicCalendar: curriculum.academicCalendar,
    };
  }
}

export class LearningLoadAdapter {
  static normalize(rawLearningLoad: any, metadata: any) {
    if (!rawLearningLoad) {
      return {
        educationLevel: metadata?.schoolLevel || "Sekolah Dasar (SD)",
        phase: metadata?.phase || "Fase A",
        academicYear: metadata?.academicYear || "2026/2027",
        weeklyLearningLoad: 32,
        annualLearningLoad: 1152,
        effectiveWeeks: 36,
        totalLearningHours: 1152
      };
    }
    
    return {
      educationLevel: rawLearningLoad.educationLevel || metadata?.schoolLevel || "Sekolah Dasar (SD)",
      phase: rawLearningLoad.phase || metadata?.phase || "Fase A",
      academicYear: rawLearningLoad.academicYear || metadata?.academicYear || "2026/2027",
      weeklyLearningLoad: parseInt(rawLearningLoad.weeklyLearningLoad) || 32,
      annualLearningLoad: parseInt(rawLearningLoad.annualLearningLoad) || 1152,
      effectiveWeeks: parseInt(rawLearningLoad.effectiveWeeks) || 36,
      totalLearningHours: parseInt(rawLearningLoad.totalLearningHours) || 1152
    };
  }
}

export class LearningOrganizationAdapter {
  static normalize(rawLearningOrg: any, metadata: any) {
    if (!rawLearningOrg) {
      return {
        educationalPhilosophy: "Pembelajaran berpusat pada peserta didik, memastikan bahwa setiap anak mendapatkan layanan pendidikan yang sesuai dengan tahap perkembangan kognitif, sosial, dan emosionalnya.",
        learningPrinciples: "Interaktif, inspiratif, menyenangkan, menantang, dan memotivasi peserta didik untuk berpartisipasi aktif, serta memberikan ruang yang cukup bagi prakarsa, kreativitas, dan kemandirian sesuai dengan bakat, minat, dan perkembangan fisik serta psikologis peserta didik.",
        implementationStrategy: "Terintegrasi melalui pendekatan holistik dalam kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dengan memanfaatkan lingkungan sekolah sebagai sumber belajar utama.",
        responsibleUnit: "Tim Pengembang Kurikulum Satuan Pendidikan bekerjasama dengan seluruh dewan guru dan komite sekolah.",
        targetLearners: "Seluruh peserta didik pada jenjang " + (metadata?.educationLevel || "Pendidikan Dasar") + ".",
        assessmentApproach: "Asesmen diagnostik pada awal pembelajaran, asesmen formatif selama proses pembelajaran, dan asesmen sumatif pada akhir materi atau semester secara komprehensif mencakup kognitif, afektif, dan psikomotorik.",
        supportingDocuments: []
      };
    }
    
    return {
      educationalPhilosophy: rawLearningOrg.educationalPhilosophy || "Pembelajaran berpusat pada peserta didik.",
      learningPrinciples: rawLearningOrg.learningPrinciples || "Interaktif, inspiratif, menyenangkan, menantang, dan memotivasi.",
      implementationStrategy: rawLearningOrg.implementationStrategy || "Terintegrasi melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler.",
      responsibleUnit: rawLearningOrg.responsibleUnit || "Tim Pengembang Kurikulum Satuan Pendidikan",
      targetLearners: rawLearningOrg.targetLearners || "Seluruh peserta didik",
      assessmentApproach: rawLearningOrg.assessmentApproach || "Asesmen komprehensif.",
      supportingDocuments: rawLearningOrg.supportingDocuments || []
    };
  }
}

export class IntracurricularAdapter {
  static normalize(rawIntracurricular: any, metadata: any) {
    if (!rawIntracurricular || !rawIntracurricular.subjects || !Array.isArray(rawIntracurricular.subjects)) {
      return {
        subjects: []
      };
    }
    
    return {
      subjects: rawIntracurricular.subjects.map((s: any, idx: number) => ({
        id: s.id || `sub-${idx}`,
        subjectName: s.subjectName || "",
        educationLevel: s.educationLevel || metadata?.educationLevel || "Sekolah Dasar",
        phase: s.phase || metadata?.phase || "Fase A",
        weeklyLearningHours: parseInt(s.weeklyLearningHours) || 0,
        annualLearningHours: parseInt(s.annualLearningHours) || 0,
        learningApproach: s.learningApproach || "Mata Pelajaran",
        profilLulusanDimensions: Array.isArray(s.profilLulusanDimensions) ? s.profilLulusanDimensions : [],
        tujuhKebiasaan: Array.isArray(s.tujuhKebiasaan) ? s.tujuhKebiasaan : [],
        deepLearningIndicators: Array.isArray(s.deepLearningIndicators) ? s.deepLearningIndicators : [],
        notes: s.notes || ""
      }))
    };
  }
}

export class ExtracurricularAdapter {
  static normalize(rawExtracurricular: any, metadata: any) {
    if (!rawExtracurricular) {
      return {
        mandatoryPrograms: [],
        optionalPrograms: [],
        routines: []
      };
    }
    
    // Handle case where rawExtracurricular is a string (e.g. generated from KSPIntelligenceEngine)
    if (typeof rawExtracurricular === 'string') {
      return {
        mandatoryPrograms: [{
          id: 'mp-auto',
          name: 'Kegiatan Ekstrakurikuler',
          description: rawExtracurricular,
          targetHabits: []
        }],
        optionalPrograms: [],
        routines: []
      };
    }

    // Handle case where it is directly an array
    if (Array.isArray(rawExtracurricular)) {
      return {
        mandatoryPrograms: rawExtracurricular.map((p, idx) => ({
          id: p.id || `mp-${idx}`,
          name: p.name || p.activityName || "Kegiatan Ekstrakurikuler",
          description: p.description || "",
          targetHabits: Array.isArray(p.targetHabits) ? p.targetHabits : []
        })),
        optionalPrograms: [],
        routines: []
      };
    }

    return {
      mandatoryPrograms: Array.isArray(rawExtracurricular.mandatoryPrograms) ? rawExtracurricular.mandatoryPrograms.map((p: any, idx: number) => ({
        id: p.id || `mp-${idx}`,
        name: p.name || "",
        description: p.description || "",
        targetHabits: Array.isArray(p.targetHabits) ? p.targetHabits : []
      })) : [],
      optionalPrograms: Array.isArray(rawExtracurricular.optionalPrograms) ? rawExtracurricular.optionalPrograms.map((p: any, idx: number) => ({
        id: p.id || `op-${idx}`,
        name: p.name || "",
        description: p.description || "",
        targetHabits: Array.isArray(p.targetHabits) ? p.targetHabits : []
      })) : [],
      routines: Array.isArray(rawExtracurricular.routines) ? rawExtracurricular.routines.map((r: any, idx: number) => ({
        id: r.id || `rt-${idx}`,
        name: r.name || "",
        frequency: r.frequency || "",
        targetHabits: Array.isArray(r.targetHabits) ? r.targetHabits : []
      })) : []
    };
  }
}

export class CocurricularAdapter {
  static normalize(rawCocurricular: any, metadata: any) {
    if (!rawCocurricular) {
      return {
        programIdentity: "Program Kokurikuler Terpadu",
        objectives: "Meningkatkan pemahaman dan penerapan Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat melalui pengalaman belajar yang bermakna di luar jam pelajaran intrakurikuler.",
        targetLearners: "Seluruh peserta didik",
        activities: [],
        assessment: "Asesmen proses, observasi, dan portofolio kegiatan.",
        reflection: "Refleksi berkala oleh pendidik dan peserta didik setelah setiap kegiatan utama.",
        supportingDocuments: []
      };
    }
    
    return {
      programIdentity: rawCocurricular.programIdentity || "Program Kokurikuler Terpadu",
      objectives: rawCocurricular.objectives || "Meningkatkan pemahaman dan penerapan Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat.",
      targetLearners: rawCocurricular.targetLearners || "Seluruh peserta didik",
      activities: Array.isArray(rawCocurricular.activities) ? rawCocurricular.activities.map((a: any, idx: number) => ({
        id: a.id || `act-${idx}`,
        activityName: a.activityName || "",
        targetPhase: a.targetPhase || metadata?.phase || "Fase A",
        implementationTime: a.implementationTime || "",
        profilLulusanDimensions: Array.isArray(a.profilLulusanDimensions) ? a.profilLulusanDimensions : [],
        tujuhKebiasaan: Array.isArray(a.tujuhKebiasaan) ? a.tujuhKebiasaan : [],
        description: a.description || ""
      })) : [],
      assessment: rawCocurricular.assessment || "Asesmen proses dan portofolio.",
      reflection: rawCocurricular.reflection || "Refleksi berkala.",
      supportingDocuments: Array.isArray(rawCocurricular.supportingDocuments) ? rawCocurricular.supportingDocuments : []
    };
  }
}
