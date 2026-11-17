import { CanonicalDocument, DocumentSection } from '../CanonicalDocumentTypes';
import { buildKspCoverSection } from './cover/KspCoverStructure';
import { buildKspApprovalSection } from './approval/KspApprovalStructure';
import { buildTeamSection } from '../frontmatter/TeamBuilder';
import { buildPrefaceSection } from '../frontmatter/PrefaceBuilder';
import { buildKspTocSection } from './toc/KspTocStructure';
import { buildKspBab1Section } from './bab1/KspBab1Structure';
import { buildKspBab2Section } from './bab2/KspBab2Structure';
import { buildKspBab3Section } from './bab3/KspBab3Structure';
import { buildKspBab4Section } from './bab4/KspBab4Structure';
import { buildKspBab5Section } from './bab5/KspBab5Structure';
import { SchoolContextKnowledgePayload, buildStudentCharacteristicDomain, buildEducatorCharacteristicDomain, buildPartnershipDomain, buildCulturalDomain, buildInfrastructureDomain, buildSpecialProgramDomain, buildAchievementDomain } from '../../knowledge/builders/SchoolContextBuilder';
import { RegulatoryKnowledgePayload } from '../../knowledge/builders/RegulatoryKnowledgeBuilder';
import { VisionMissionKnowledge, buildVisionMission } from '../../knowledge/builders/VisionMissionBuilder';
import { processVisionMission, VisionMissionInput } from '../../knowledge/services/VisionMissionService';
import { CurriculumStructureKnowledge } from '../../knowledge/models/curriculum/CurriculumStructureKnowledge';
import { LearningLoadKnowledge } from '../../knowledge/models/curriculum/LearningLoadKnowledge';
import { AcademicCalendarKnowledge, buildAcademicCalendar } from '../../knowledge/builders/AcademicCalendarBuilder';
import { processAcademicCalendar, AcademicCalendarInput } from '../../knowledge/services/AcademicCalendarService';
import { KspMetadata } from '../../../ksp/KspMetadataAdapter';
import { LearningLoadAdapter, LearningOrganizationAdapter, IntracurricularAdapter, CocurricularAdapter, ExtracurricularAdapter } from '../../workspace/adapters/CurriculumAdapter';
import { CocurricularKnowledge } from '../../knowledge/models/curriculum/CocurricularKnowledge';
import { IntracurricularKnowledge } from '../../knowledge/models/curriculum/IntracurricularKnowledge';
import { LearningOrganizationKnowledge } from '../../knowledge/models/curriculum/LearningOrganizationKnowledge';
import { ExtracurricularKnowledge } from '../../knowledge/models/curriculum/ExtracurricularKnowledge';

export function assembleKspDocument(metadata: KspMetadata): CanonicalDocument {
  const isProvincialAuthority = ['SMA', 'SMK', 'SLB'].includes(metadata.schoolLevel);
  const educationAuthorityRegion = isProvincialAuthority ? metadata.province : metadata.regencyOrCity;

  const coverSection = buildKspCoverSection({
    ...metadata,
    educationAuthorityRegion
  } as any);
  
  const approvalSection = buildKspApprovalSection({
    ...metadata,
    educationAuthorityRegion
  } as any);

  const schoolContextPayload: SchoolContextKnowledgePayload = {
    profile: {
      schoolName: metadata.schoolName,
      schoolLevel: metadata.schoolLevel,
      schoolStatus: metadata.schoolStatus,
      village: metadata.village,
      district: metadata.district,
      city: metadata.regencyOrCity,
      province: metadata.province
    } as any,
    context: {
      profile: { schoolName: metadata.schoolName } as any,
      academicYear: { year: metadata.academicYear } as any
    } as any,
    students: (metadata.rawStudents || metadata.rawRombel) ? buildStudentCharacteristicDomain(metadata.rawStudents, metadata.rawRombel) : undefined,
    educators: buildEducatorCharacteristicDomain(
      metadata.rawCharacteristics,
      metadata.rawTeachers,
      metadata.rawEducationStaff,
      metadata.principalName,
      metadata.principalPosition
    ),
    partnerships: buildPartnershipDomain(metadata.rawCharacteristics, metadata.rawCommittee),
    culture: buildCulturalDomain(metadata.rawCharacteristics, metadata.rawPotential),
    specialPrograms: buildSpecialProgramDomain(metadata.rawSpecialPrograms),
    achievements: buildAchievementDomain(metadata.rawAchievements),
    infrastructure: buildInfrastructureDomain(metadata.rawFacilities)
  };

  const regulatoryPayload: RegulatoryKnowledgePayload = {
    regulations: [
      { id: "reg-1", name: "Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional" },
      { id: "reg-2", name: "Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan atas Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan" },
      { id: "reg-3", name: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 5 Tahun 2022 tentang Standar Kompetensi Lulusan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah" },
      { id: "reg-4", name: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 8 Tahun 2024 tentang Standar Isi pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah" },
      { id: "reg-5", name: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 16 Tahun 2022 tentang Standar Proses pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah" },
      { id: "reg-6", name: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 21 Tahun 2022 tentang Standar Penilaian Pendidikan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah" },
      { id: "reg-7", name: "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 12 Tahun 2024 tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah" }
    ]
  };

  const bab1Section = buildKspBab1Section(schoolContextPayload, regulatoryPayload);

  const rawStrategicPolicy = metadata.rawStrategicPolicy;
  const visionMissionInput: VisionMissionInput = {
    profile: {
      metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'Draft', domain: 'SchoolProfile' },
      workspaceId: metadata.npsn,
      schoolName: metadata.schoolName,
      npsn: metadata.npsn,
      status: 'NEGERI',
      level: metadata.schoolLevel || metadata.educationLevel || 'SD'
    } as any,
    governance: { metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'Draft', domain: 'SchoolGovernance' } } as any,
    academicYear: { metadata: { id: '', version: '1.0', createdAt: '', updatedAt: '', createdBy: '', lifecycle: 'Draft', domain: 'AcademicYear' }, year: metadata.academicYear, isActive: true } as any,
    strategicPolicy: rawStrategicPolicy
  };
  const vmServiceResult = processVisionMission(visionMissionInput);
  const vmKnowledge = buildVisionMission({ serviceResult: vmServiceResult });
  
  const bab2Section = buildKspBab2Section(vmKnowledge.data, metadata.schoolName);

  const curriculumStructurePayload = new CurriculumStructureKnowledge(
    "struct-1",
    "1.0.0",
    {
      educationLevel: metadata.schoolLevel || "Sekolah Dasar",
      phase: metadata.phase || "A, B, dan C",
      curriculumType: "Kurikulum Merdeka"
    }
  );
    
  const normalizedLearningLoad = LearningLoadAdapter.normalize(metadata.rawLearningLoad, metadata);
  const learningLoadPayload = new LearningLoadKnowledge(
    "ll-1",
    "1.0.0",
    normalizedLearningLoad
  );

  const normalizedLearningOrg = LearningOrganizationAdapter.normalize(metadata.rawLearningOrganization, metadata);
  const learningOrganizationPayload = new LearningOrganizationKnowledge(
    "lo-1",
    "1.0.0",
    normalizedLearningOrg
  );

  const normalizedIntracurricular = IntracurricularAdapter.normalize(metadata.rawIntracurricular, metadata);
  const intracurricularPayload = new IntracurricularKnowledge(
    "ic-1",
    "1.0.0",
    normalizedIntracurricular
  );

  const normalizedCocurricular = CocurricularAdapter.normalize(metadata.rawCocurricular, metadata);
  const cocurricularPayload = new CocurricularKnowledge(
    "cc-1",
    "1.0.0",
    normalizedCocurricular
  );

  const normalizedExtracurricular = ExtracurricularAdapter.normalize(metadata.rawExtracurricular, metadata);
  const extracurricularPayload: ExtracurricularKnowledge = {
    id: "ec-1",
    knowledgeOwner: "Curriculum Hub",
    governmentSource: "Kemendikdasmen",
    version: "1.0.0",
    metadata: {
      kemendikdasmenAligned: true,
      deepLearningAligned: true,
      profilLulusanDimensions: [],
      tujuhKebiasaan: []
    },
    validationRules: [],
    payload: normalizedExtracurricular
  };

  const calendarInput: AcademicCalendarInput = {
    academicYear: {
      metadata: { id: '', version: '1.0', owner: '', lifecycle: 'Draft', domain: 'AcademicYear', createdAt: '', updatedAt: '', createdBy: '' },
      properties: {
        currentYear: metadata.academicYear,
        events: metadata.rawAcademicCalendar?.events || [],
        effectiveWeeks: metadata.rawAcademicCalendar?.effectiveWeeks || 36,
        effectiveLearningDays: metadata.rawAcademicCalendar?.effectiveLearningDays || 180,
      }
    } as any
  };
  const calendarServiceResult = processAcademicCalendar(calendarInput);
  const calendarKnowledge = buildAcademicCalendar({ serviceResult: calendarServiceResult });

  const bab3Section = buildKspBab3Section(curriculumStructurePayload, learningLoadPayload, learningOrganizationPayload, intracurricularPayload, cocurricularPayload, extracurricularPayload, calendarKnowledge.data);

  const learningPolicyPayload = metadata.rawLearningPolicy || {
    principles: [],
    approach: '',
    planningPolicy: '',
    assessmentPolicy: [],
    inclusiveEducation: '',
    differentiationPolicy: '',
    digitalLearning: '',
    partnershipPolicy: '',
    characterEducation: ''
  };
  const bab4Section = buildKspBab4Section(learningPolicyPayload);

  const evaluationPayload = metadata.rawEvaluation || {
    evaluationMechanisms: [],
    schedule: '',
    responsibleParties: [],
    professionalDevelopment: [],
    monitoringPolicy: '',
    academicSupervision: '',
    continuousImprovement: '',
    qualityAssurance: '',
    followUpPlanning: '',
    schoolLevelMentoring: ''
  };
  const bab5Section = buildKspBab5Section(evaluationPayload);

  const teamSection = buildTeamSection({
    documentId: 'KSP-001',
    title: 'Kurikulum Satuan Pendidikan',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    draftingTeam: metadata.draftingTeam
  });

  const prefaceSection = buildPrefaceSection({
    schoolName: metadata.schoolName,
    academicYear: metadata.academicYear,
    regencyOrCity: metadata.regencyOrCity,
    approvalDate: metadata.approvalDate,
    principalName: metadata.principalName,    
    principalNip: metadata.principalNip,
    principalPosition: metadata.principalPosition
  });

  const tocSection = buildKspTocSection([
    coverSection,
    approvalSection,
    teamSection,
    prefaceSection,
    bab1Section,
    bab2Section,
    bab3Section,
    bab4Section,
    bab5Section
  ]);

  const sections = [
    coverSection,
    approvalSection,
    teamSection,
    prefaceSection,
    tocSection,
    bab1Section,
    bab2Section,
    bab3Section,
    bab4Section,
    bab5Section
  ];

  return {
    id: `KSP-DOC-${Date.now()}`,
    metadata: {
      documentId: 'KSP-001',
      title: 'Kurikulum Satuan Pendidikan',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      draftingTeam: metadata.draftingTeam
    },
    sections
  };
}
