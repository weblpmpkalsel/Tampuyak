import { EnterpriseAdapter } from '../enterprise/workspace/adapters/EnterpriseAdapter';
import { mapWorkspaceToEnterprise } from '../workspace/contracts/WorkspaceContractMapper';
import { useApp } from "../Tampuyak";

export interface KspMetadata {
  schoolName: string;
  npsn: string;
  address: string;
  village: string;
  district: string;
  regencyOrCity: string;
  province: string;
  academicYear: string;
  schoolLevel: string;
  educationLevel: string;
  phase: string;
  schoolLogoUrl: string | null;
  governmentLogoUrl: string | null;
  schoolStatus: string;
  principalName: string;
  principalNip: string;
  principalPosition: string;
  supervisorName: string;
  supervisorNip: string;
  supervisorPosition: string;
  headOfEducationOfficeName: string;
  headOfEducationOfficeNip: string;
  headOfEducationOfficePosition: string;
  schoolCommitteeName: string;
  approvalDate?: string;
  documentNumber?: string;
  rawStudents?: any;
  rawCharacteristics?: any;
  rawStrategicPolicy?: any;
  draftingTeam?: readonly { name: string; role: string; identifier?: string }[];
  rawLearningLoad?: any;
  rawLearningOrganization?: any;
  rawIntracurricular?: any;
  rawCocurricular?: any;
  rawExtracurricular?: any;
  rawAcademicCalendar?: any;
  rawLearningPolicy?: any;
  rawEvaluation?: any;
  rawRombel?: any[];
  rawTeachers?: any[];
  rawEducationStaff?: any[];
  rawFacilities?: any;
  rawPotential?: any;
  rawCommittee?: any;
  rawSpecialPrograms?: any;
  rawAchievements?: any;
}

export class KspMetadataAdapter {
  static adapt(rawSettings: any): KspMetadata {
    const settings = EnterpriseAdapter.normalize(rawSettings);
    const schoolLevel = settings?.school?.level || 'SD';
    let phase = ''; // delegated to WorkspaceContractMapper

        const activeYear = settings?.academicYears?.find((y: any) => y.isActive);
    const fallbackYear = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
    const academicYear = activeYear?.name || fallbackYear;
    
    const rawApprovalDate = settings?.administrasi?.establishmentDate || settings?.administrasi?.approvalDate || settings?.approval?.date || '';
    let approvalDateStr = rawApprovalDate;
    if (rawApprovalDate) {
        try {
            const d = new Date(rawApprovalDate);
            if (!isNaN(d.getTime())) {
                approvalDateStr = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
            }
        } catch (e) {
            // ignore
        }
    }
    
    const baseMetadata: KspMetadata = {
      schoolName: settings?.school?.name || '',
      npsn: settings?.school?.npsn || '',
      address: settings?.school?.address || '',
      village: settings?.school?.village || '',
      district: settings?.school?.district || '',
      regencyOrCity: settings?.administrasi?.establishmentPlace || settings?.school?.regency || '',
      province: settings?.school?.province || '',
      academicYear: settings?.administrasi?.academicYear || academicYear,
      schoolLevel: schoolLevel,
      educationLevel: schoolLevel,
      phase: phase,
      schoolLogoUrl: settings?.identityAssets?.schoolLogo?.url || settings?.branding?.logoUrl || null,
      governmentLogoUrl: settings?.identityAssets?.governmentLogo?.url || settings?.school?.governmentLogo || null,
      schoolStatus: settings?.school?.status || '',
      principalName: settings?.principal?.name || '',
      principalNip: settings?.principal?.nip || '',
      principalPosition: settings?.principal?.position || 'Kepala Sekolah',
      supervisorName: settings?.pengawas?.name || '',
      supervisorNip: settings?.pengawas?.nip || '',
      supervisorPosition: 'Pengawas Sekolah',
      headOfEducationOfficeName: settings?.kepalaDinas?.name || '',
      headOfEducationOfficeNip: settings?.kepalaDinas?.nip || '',
      headOfEducationOfficePosition: settings?.kepalaDinas?.jabatan || '',
      schoolCommitteeName: settings?.komite?.name || '',
      approvalDate: approvalDateStr,
      documentNumber: settings?.administrasi?.documentNumber || settings?.approval?.documentNumber || '',
      draftingTeam: settings?.draftingTeam || undefined,
      rawCharacteristics: settings?.karakteristik || undefined,
      rawStudents: (settings?.pesertaDidik || settings?.karakteristik?.pesertaDidik) ? {
        totalStudents: settings?.pesertaDidik?.total || undefined,
        genderDistribution: (settings?.pesertaDidik?.lakiLaki !== undefined || settings?.pesertaDidik?.perempuan !== undefined) ? { male: settings.pesertaDidik.lakiLaki || 0, female: settings.pesertaDidik.perempuan || 0 } : undefined,
        generalCharacteristics: settings?.karakteristik?.pesertaDidik ? [settings.karakteristik.pesertaDidik] : undefined,
        dominantLearningNeeds: settings?.pesertaDidik?.dominantLearningNeeds || undefined
      } : undefined,
      rawLearningLoad: settings?.learningLoad || undefined,
      rawLearningOrganization: settings?.learningOrganization || undefined,
      rawIntracurricular: settings?.intracurricular || undefined,
      rawCocurricular: settings?.cocurricular || undefined,
      rawExtracurricular: settings?.extracurricular || undefined,
      rawAcademicCalendar: settings?.academicCalendar || undefined,
      rawLearningPolicy: settings?.learningPolicy || undefined,
      rawEvaluation: settings?.evaluation || undefined,
      rawStrategicPolicy: settings?.identitas ? {
        vision: settings.identitas.visi || '',
        mission: settings.identitas.misi || [],
        goals: settings.identitas.tujuan || []
      } : undefined,
      rawRombel: settings?.rombel || undefined,
      rawTeachers: settings?.guru || undefined,
      rawEducationStaff: settings?.tendik || undefined,
      rawFacilities: settings?.sarpras || undefined,
      rawPotential: settings?.potensi || undefined,
      rawCommittee: settings?.komite || undefined,
      rawSpecialPrograms: settings?.programUnggulan || undefined,
      rawAchievements: settings?.prestasi || undefined,
    };
    return mapWorkspaceToEnterprise(settings, baseMetadata);
  }
}

export function useKspMetadata(): KspMetadata {
  const { settings } = useApp();
  return KspMetadataAdapter.adapt(settings);
}
