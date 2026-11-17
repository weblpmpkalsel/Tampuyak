const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/modules/CurriculumHubModule.tsx', 'utf8');

const importsToAdd = `import { LearningLoadAdapter, LearningOrganizationAdapter, IntracurricularAdapter, CocurricularAdapter, ExtracurricularAdapter } from '../adapters/CurriculumAdapter';\nimport { KspMetadataAdapter } from '../../../ksp/KspMetadataAdapter';\n`;
code = code.replace("import { useEffect } from 'react';", importsToAdd + "import { useEffect } from 'react';");

code = code.replace(
  `  const [knowledge, setKnowledge] = useState<CurriculumStructureKnowledge>(
    new CurriculumStructureKnowledge('cs-1', '1.0.0', {
      educationLevel: 'Sekolah Dasar (SD)',
      phase: 'Fase A, B, dan C',
      curriculumType: 'Kurikulum Merdeka'
    })
  );`,
  `  const metadata = KspMetadataAdapter.adapt(settings);
  const [knowledge, setKnowledge] = useState<CurriculumStructureKnowledge>(
    new CurriculumStructureKnowledge('cs-1', '1.0.0', {
      educationLevel: metadata.schoolLevel || 'Sekolah Dasar (SD)',
      phase: metadata.phase || 'Fase A, B, dan C',
      curriculumType: 'Kurikulum Merdeka'
    })
  );`
);

code = code.replace(
  `  const [learningLoad, setLearningLoad] = useState<LearningLoadKnowledge>(
    new LearningLoadKnowledge('ll-1', '1.0.0', {
      educationLevel: 'Sekolah Dasar (SD)',
      phase: 'Fase A',
      academicYear: '2026/2027',
      weeklyLearningLoad: 32,
      annualLearningLoad: 1152,
      effectiveWeeks: 36,
      totalLearningHours: 1152
    })
  );`,
  `  const [learningLoad, setLearningLoad] = useState<LearningLoadKnowledge>(
    new LearningLoadKnowledge('ll-1', '1.0.0', LearningLoadAdapter.normalize(settings?.curriculum?.learningLoad || settings?.learningLoad, metadata))
  );`
);

code = code.replace(
  `  const [learningOrganization, setLearningOrganization] = useState<LearningOrganizationKnowledge>(
    new LearningOrganizationKnowledge('lo-1', '1.0.0', {
      educationalPhilosophy: "Pembelajaran berpusat pada peserta didik, memastikan bahwa setiap anak mendapatkan layanan pendidikan yang sesuai dengan tahap perkembangan kognitif, sosial, dan emosionalnya.",
      learningPrinciples: "Interaktif, inspiratif, menyenangkan, menantang, dan memotivasi peserta didik untuk berpartisipasi aktif, serta memberikan ruang yang cukup bagi prakarsa, kreativitas, dan kemandirian sesuai dengan bakat, minat, dan perkembangan fisik serta psikologis peserta didik.",
      implementationStrategy: "Terintegrasi melalui pendekatan holistik dalam kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler dengan memanfaatkan lingkungan sekolah sebagai sumber belajar utama.",
      responsibleUnit: "Tim Pengembang Kurikulum Satuan Pendidikan bekerjasama dengan seluruh dewan guru dan komite sekolah.",
      targetLearners: "Seluruh peserta didik.",
      assessmentApproach: "Asesmen diagnostik pada awal pembelajaran, asesmen formatif selama proses pembelajaran, dan asesmen sumatif pada akhir materi atau semester secara komprehensif mencakup kognitif, afektif, dan psikomotorik.",
      supportingDocuments: []
    })
  );`,
  `  const [learningOrganization, setLearningOrganization] = useState<LearningOrganizationKnowledge>(
    new LearningOrganizationKnowledge('lo-1', '1.0.0', LearningOrganizationAdapter.normalize(settings?.curriculum?.learningOrganization || settings?.learningOrganization, metadata))
  );`
);

code = code.replace(
  `  const [intracurricular, setIntracurricular] = useState<IntracurricularKnowledge>(
    new IntracurricularKnowledge('ic-1', '1.0.0', {
      subjects: []
    })
  );`,
  `  const [intracurricular, setIntracurricular] = useState<IntracurricularKnowledge>(
    new IntracurricularKnowledge('ic-1', '1.0.0', IntracurricularAdapter.normalize(settings?.curriculum?.intracurricular || settings?.intracurricular, metadata))
  );`
);

code = code.replace(
  `  const [cocurricular, setCocurricular] = useState<CocurricularKnowledge>(
    new CocurricularKnowledge('cc-1', '1.0.0', {
      programIdentity: "Program Kokurikuler Terpadu",
      objectives: "Meningkatkan pemahaman dan penerapan Dimensi Profil Lulusan serta 7 Kebiasaan Anak Indonesia Hebat.",
      targetLearners: "Seluruh peserta didik",
      activities: [],
      assessment: "Asesmen proses, observasi, dan portofolio kegiatan.",
      reflection: "Refleksi berkala oleh pendidik dan peserta didik.",
      supportingDocuments: []
    })
  );`,
  `  const [cocurricular, setCocurricular] = useState<CocurricularKnowledge>(
    new CocurricularKnowledge('cc-1', '1.0.0', CocurricularAdapter.normalize(settings?.curriculum?.cocurricular || settings?.cocurricular, metadata))
  );`
);

code = code.replace(
  `  const [extracurricular, setExtracurricular] = useState({
    mandatoryPrograms: [
      { id: 'mp-1', name: 'Pramuka', description: 'Kegiatan ekstrakurikuler wajib sesuai perundang-undangan.', targetHabits: [] }
    ],
    optionalPrograms: [],
    routines: []
  });`,
  `  const [extracurricular, setExtracurricular] = useState(ExtracurricularAdapter.normalize(settings?.curriculum?.extracurricular || settings?.extracurricular, metadata));`
);

code = code.replace(
  `  const [academicCalendar, setAcademicCalendar] = useState({
    academicYear: '2026/2027',
    semester1Start: '',
    semester2Start: '',
    notes: ''
  });`,
  `  const [academicCalendar, setAcademicCalendar] = useState(settings?.curriculum?.academicCalendar || settings?.academicCalendar || {
    academicYear: metadata.academicYear || '2026/2027',
    semester1Start: '',
    semester2Start: '',
    notes: ''
  });`
);

fs.writeFileSync('src/enterprise/workspace/modules/CurriculumHubModule.tsx', code);
console.log("Patched");
