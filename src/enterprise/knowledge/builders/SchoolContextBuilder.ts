import { CanonicalSchoolProfileOutput } from '../services/SchoolProfileService';
import { SchoolContextServiceResult, SchoolContextPayload } from '../services/SchoolContextService';
import { CanonicalKnowledgeObject, KnowledgeSource } from '../contracts/KnowledgeTypes';

export interface ClassStatistic {
  className: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

export interface StudentCharacteristicDomain {
  totalStudents?: number;
  genderDistribution?: { male: number; female: number };
  generalCharacteristics?: string[];
  dominantLearningNeeds?: string[];
  clinicalBarriers?: string[];
  talentsAndInterests?: string[];
  classes?: ClassStatistic[];
}

export function buildStudentCharacteristicDomain(rawObservation?: any, rawRombel?: any[]): StudentCharacteristicDomain | undefined {
  if ((!rawObservation || Object.keys(rawObservation).length === 0) && (!rawRombel || rawRombel.length === 0)) {
    return undefined;
  }
  
  let classes: ClassStatistic[] | undefined = undefined;
  if (rawRombel && Array.isArray(rawRombel)) {
    classes = rawRombel.map(rombel => {
      const male = Number(rombel.lakiLaki) || 0;
      const female = Number(rombel.perempuan) || 0;
      const totalSiswa = male + female || Number(rombel.total) || Number(rombel.siswa) || 0;
      return {
        className: rombel.name || rombel.nama || '',
        maleCount: male,
        femaleCount: female,
        totalCount: totalSiswa
      };
    });
  }

  return {
    totalStudents: rawObservation?.totalStudents,
    genderDistribution: rawObservation?.genderDistribution,
    generalCharacteristics: rawObservation?.generalCharacteristics,
    dominantLearningNeeds: rawObservation?.dominantLearningNeeds,
    classes
  };
}

/**
 * Payload representing the assembled School Context knowledge domain.
 */
export interface EducatorStatistic {
  name: string;
  educationLevel: string;
  certificationStatus: string;
  position: string;
}

export interface EducatorKnowledgeDomain {
  totalTeachers?: number;
  certifications?: string[];
  leadershipHierarchy?: string[];
  specializedStaff?: string[];
  generalCharacteristics?: string[];
  teachers?: EducatorStatistic[];
  educationStaff?: EducatorStatistic[];
  principal?: EducatorStatistic;
}

export function buildEducatorCharacteristicDomain(
  rawCharacteristics?: any,
  rawTeachers?: any[],
  rawEducationStaff?: any[],
  principalName?: string,
  principalPosition?: string
): EducatorKnowledgeDomain | undefined {
  if (!rawCharacteristics && (!rawTeachers || rawTeachers.length === 0) && (!rawEducationStaff || rawEducationStaff.length === 0) && !principalName) return undefined;
  
  const pendidikText = rawCharacteristics?.pendidik || rawCharacteristics?.guru;
  
  const teachers: EducatorStatistic[] = (rawTeachers || []).map(t => ({
    name: t.name || t.nama || '',
    educationLevel: t.educationLevel || t.pendidikan || '',
    certificationStatus: t.certificationStatus || t.sertifikasi || '',
    position: t.position || t.jabatan || 'Guru'
  }));

  const educationStaff: EducatorStatistic[] = (rawEducationStaff || []).map(s => ({
    name: s.name || s.nama || '',
    educationLevel: s.educationLevel || s.pendidikan || '',
    certificationStatus: s.certificationStatus || s.sertifikasi || '',
    position: s.position || s.jabatan || 'Tenaga Kependidikan'
  }));

  let principal: EducatorStatistic | undefined = undefined;
  if (principalName) {
    principal = {
      name: principalName,
      educationLevel: '',
      certificationStatus: '',
      position: principalPosition || 'Kepala Sekolah'
    };
  }

  return {
    generalCharacteristics: pendidikText ? [pendidikText] : undefined,
    teachers: teachers.length > 0 ? teachers : undefined,
    educationStaff: educationStaff.length > 0 ? educationStaff : undefined,
    principal
  };
}

export interface FacilityStatistic {
  facilityName: string;
  quantity: number;
  condition?: string;
}

export interface InfrastructureKnowledgeDomain {
  totalClassrooms: number;
  specializedLabs: string[];
  internetBandwidth: string;
  accessibilityFeatures?: string[];
  facilities?: FacilityStatistic[];
}

export function buildInfrastructureDomain(raw?: any): InfrastructureKnowledgeDomain | undefined {
  if (!raw) return undefined;
  
  const facilities: FacilityStatistic[] = [];
  let totalClassrooms = 0;
  const specializedLabs: string[] = [];
  
  if (raw.ruangKelas !== undefined) {
    totalClassrooms = Number(raw.ruangKelas) || 0;
    facilities.push({ facilityName: 'Ruang Kelas', quantity: totalClassrooms, condition: 'Baik' });
  }
  if (raw.perpustakaan !== undefined) {
    facilities.push({ facilityName: 'Perpustakaan (Library)', quantity: Number(raw.perpustakaan) || 0, condition: 'Baik' });
  }
  if (raw.laboratorium !== undefined) {
    specializedLabs.push('Laboratorium Komputer/Sains');
    facilities.push({ facilityName: 'Laboratorium (Laboratory)', quantity: Number(raw.laboratorium) || 0, condition: 'Baik' });
  }
  if (raw.uks !== undefined) {
    facilities.push({ facilityName: 'UKS (Usaha Kesehatan Sekolah)', quantity: Number(raw.uks) || 0, condition: 'Baik' });
  }
  if (raw.toilet !== undefined) {
    facilities.push({ facilityName: 'Toilet/Kamar Mandi', quantity: Number(raw.toilet) || 0, condition: 'Baik' });
  }
  if (raw.mushola !== undefined || raw.tempatIbadah !== undefined) {
    facilities.push({ facilityName: 'Tempat Ibadah (Place of Worship)', quantity: Number(raw.mushola || raw.tempatIbadah) || 0, condition: 'Baik' });
  }
  if (raw.lapangan !== undefined) {
    facilities.push({ facilityName: 'Lapangan Olahraga', quantity: Number(raw.lapangan) || 0, condition: 'Baik' });
  }
  if (raw.ruangGuru !== undefined) {
    facilities.push({ facilityName: 'Ruang Guru', quantity: Number(raw.ruangGuru) || 0, condition: 'Baik' });
  }
  if (raw.ruangKepsek !== undefined) {
    facilities.push({ facilityName: 'Ruang Kepala Sekolah', quantity: Number(raw.ruangKepsek) || 0, condition: 'Baik' });
  }
  if (raw.ict !== undefined || raw.tik !== undefined) {
    facilities.push({ facilityName: 'Fasilitas TIK (ICT Facilities)', quantity: Number(raw.ict || raw.tik) || 0, condition: 'Baik' });
  }
  if (raw.learningResources !== undefined || raw.sumberBelajar !== undefined) {
    facilities.push({ facilityName: 'Sumber Belajar (Learning Resources)', quantity: Number(raw.learningResources || raw.sumberBelajar) || 0, condition: 'Baik' });
  }

  // Fallback
  if (facilities.length === 0 && typeof raw === 'object') {
    for (const key of Object.keys(raw)) {
      facilities.push({ facilityName: key, quantity: Number(raw[key]) || 0 });
      if (key.toLowerCase().includes('kelas')) {
        totalClassrooms += Number(raw[key]) || 0;
      }
    }
  }

  return {
    totalClassrooms,
    specializedLabs,
    internetBandwidth: 'Memadai',
    facilities: facilities.length > 0 ? facilities : undefined
  };
}

export interface PartnershipKnowledgeDomain {
  parentCommunities?: string[];
  industryLinkages?: string[];
  localGovernmentPartners?: string[];
  generalCharacteristics?: string[];
  committeeName?: string;
  committeeContact?: string;
  committeeMembers?: { name: string; role: string }[];
}

export function buildPartnershipDomain(rawChars?: any, rawCommittee?: any): PartnershipKnowledgeDomain | undefined {
  if (!rawChars && !rawCommittee) return undefined;
  return {
    generalCharacteristics: rawChars?.orangTua ? [rawChars.orangTua] : undefined,
    committeeName: rawCommittee?.name || undefined,
    committeeContact: rawCommittee?.phone || undefined,
  };
}

export interface CulturalKnowledgeDomain {
  localWisdomTraditions?: string[];
  prevailingRegionalCharacteristics?: string[];
  environmentalFactors?: string[];
  regionalPotentials?: string[];
  localWisdoms?: string[];
}

export function buildCulturalDomain(rawChars?: any, rawPotentials?: any): CulturalKnowledgeDomain | undefined {
  if (!rawChars && !rawPotentials) return undefined;
  return {
    prevailingRegionalCharacteristics: Array.isArray(rawChars?.lokasi) ? rawChars.lokasi : (rawChars?.lokasi ? [rawChars.lokasi] : undefined),
    environmentalFactors: Array.isArray(rawChars?.lingkungan) ? rawChars.lingkungan : (rawChars?.lingkungan ? [rawChars.lingkungan] : undefined),
    regionalPotentials: Array.isArray(rawPotentials?.daerah) ? rawPotentials.daerah : (rawPotentials?.daerah ? [rawPotentials.daerah] : undefined),
    localWisdoms: Array.isArray(rawPotentials?.kearifanLokal) ? rawPotentials.kearifanLokal : (rawPotentials?.kearifanLokal ? [rawPotentials.kearifanLokal] : undefined)
  };
}

export interface SpecialProgramKnowledgeDomain {
  programs: { name: string; description: string; target?: string }[];
}

export function buildSpecialProgramDomain(rawPrograms?: any): SpecialProgramKnowledgeDomain | undefined {
  if (!rawPrograms) return undefined;
  let programs: any[] = [];
  if (Array.isArray(rawPrograms)) {
    programs = rawPrograms.map(p => {
      if (typeof p === 'string') return { name: p, description: p };
      return {
        name: p.name || p.nama || 'Program Unggulan',
        description: p.description || p.deskripsi || p.name || 'Deskripsi tidak tersedia',
        target: p.target || p.sasaran || undefined
      };
    });
  } else if (typeof rawPrograms === 'string') {
     programs.push({ name: rawPrograms, description: rawPrograms });
  }
  if (programs.length === 0) return undefined;
  return { programs };
}

export interface AchievementKnowledgeDomain {
  achievements: { title: string; year?: string; level?: string }[];
}

export function buildAchievementDomain(rawAchievements?: any): AchievementKnowledgeDomain | undefined {
  if (!rawAchievements) return undefined;
  let achievements: any[] = [];
  if (Array.isArray(rawAchievements)) {
    achievements = rawAchievements.map(a => {
      if (typeof a === 'string') return { title: a };
      return {
        title: a.title || a.prestasi || a.nama || 'Prestasi',
        year: a.year || a.tahun || undefined,
        level: a.level || a.tingkat || undefined
      };
    });
  } else if (typeof rawAchievements === 'string') {
     achievements.push({ title: rawAchievements });
  }
  if (achievements.length === 0) return undefined;
  return { achievements };
}


export interface GovernanceKnowledgeDomain {
  accreditationStatus: string;
  governingBody: string;
  regulatoryRegion: string;
}

export interface SchoolContextKnowledgePayload {
  profile: CanonicalSchoolProfileOutput['data'];
  context: SchoolContextPayload;
  students?: StudentCharacteristicDomain;
  educators?: EducatorKnowledgeDomain;
  infrastructure?: InfrastructureKnowledgeDomain;
  partnerships?: PartnershipKnowledgeDomain;
  culture?: CulturalKnowledgeDomain;
  governance?: GovernanceKnowledgeDomain;
  specialPrograms?: SpecialProgramKnowledgeDomain;
  achievements?: AchievementKnowledgeDomain;
}

/**
 * Input arguments for building School Context.
 * Receives the already-processed outputs from the Knowledge Services.
 */
export interface SchoolContextBuilderInput {
  profileServiceResult: CanonicalSchoolProfileOutput;
  contextServiceResult: SchoolContextServiceResult;
  studentCharacteristics?: StudentCharacteristicDomain;
  educatorKnowledge?: EducatorKnowledgeDomain;
  infrastructureKnowledge?: InfrastructureKnowledgeDomain;
  partnershipKnowledge?: PartnershipKnowledgeDomain;
  culturalKnowledge?: CulturalKnowledgeDomain;
  governanceKnowledge?: GovernanceKnowledgeDomain;
  specialProgramKnowledge?: SpecialProgramKnowledgeDomain;
  achievementKnowledge?: AchievementKnowledgeDomain;
}

/**
 * Output of the SchoolContextBuilder.
 */
export interface SchoolContextBuilderResult {
  knowledge: CanonicalKnowledgeObject<SchoolContextKnowledgePayload>;
  knowledgeSources: Record<string, KnowledgeSource>;
}

const BUILDER_VERSION = '1.0.0';

/**
 * Assembles School Context knowledge from Enterprise Knowledge Services.
 * Performs pure orchestration without validation or normalization.
 * 
 * @param input Processed results from SchoolProfileService and SchoolContextService
 * @returns Canonical Knowledge Object containing the assembled School Context payload
 */
export function buildSchoolContext(input: SchoolContextBuilderInput): SchoolContextBuilderResult {
  const payload: SchoolContextKnowledgePayload = {
    profile: input.profileServiceResult.data,
    context: input.contextServiceResult.knowledge.data,
    students: input.studentCharacteristics,
    educators: input.educatorKnowledge,
    infrastructure: input.infrastructureKnowledge,
    partnerships: input.partnershipKnowledge,
    culture: input.culturalKnowledge,
    governance: input.governanceKnowledge,
    specialPrograms: input.specialProgramKnowledge,
    achievements: input.achievementKnowledge
  };

  const sourceKnowledge = input.contextServiceResult.knowledge;

  // Enterprise Rule 032 & 039: Pass-through the source knowledge metadata.
  // The primary service result for School Context is contextServiceResult.
  const knowledge: CanonicalKnowledgeObject<SchoolContextKnowledgePayload> = {
    ...sourceKnowledge,
    metadata: {
      ...sourceKnowledge.metadata,
      domain: 'SchoolContextKnowledge'
    },
    data: payload
  };

  const knowledgeSources: Record<string, KnowledgeSource> = {
    profile: {
      origin: 'MASTER_DATA',
      serviceVersion: input.profileServiceResult.processingMetadata.serviceVersion
    },
    context: input.contextServiceResult.knowledge.metadata.source
  };

  return {
    knowledge,
    knowledgeSources
  };
}
