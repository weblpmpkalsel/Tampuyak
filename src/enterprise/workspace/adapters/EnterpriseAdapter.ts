import { EnterpriseProfileAdapter } from './EnterpriseProfileAdapter';
import { StudentProfileAdapter } from './StudentProfileAdapter';
import { CurriculumAdapter } from './CurriculumAdapter';
import { EvaluationAdapter } from './EvaluationAdapter';
import { AdministrativeMetadataAdapter } from './AdministrativeMetadataAdapter';

export class EnterpriseAdapter {
  static mergeNonEmpty(legacy: any, modern: any) {
    if (!legacy) return modern || {};
    if (!modern) return legacy || {};
    const result = { ...legacy };
    for (const key in modern) {
      const val = modern[key];
      if (val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0)) {
        if (typeof val === 'object' && !Array.isArray(val) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
            result[key] = EnterpriseAdapter.mergeNonEmpty(result[key], val);
        } else {
            result[key] = val;
        }
      }
    }
    return result;
  }

  static normalize(rawSettings: any): any {
    if (!rawSettings) return {};

    // 1. Run all module adapters
    const profileNormalized = EnterpriseProfileAdapter.normalize(rawSettings.enterpriseProfile);
    const studentNormalized = StudentProfileAdapter.normalize(rawSettings.studentProfile);
    const curriculumNormalized = CurriculumAdapter.normalize(rawSettings.curriculum);
    const evaluationNormalized = EvaluationAdapter.normalize(rawSettings.evaluation);
    const adminNormalized = AdministrativeMetadataAdapter.normalize(rawSettings.administrative);

    // 2. Merge normalized payload OVER the raw legacy settings
    // This allows the Metadata Adapter to consume the unified shape without knowing about enterprise modules
    // We prioritize legacy settings that are non-empty over modular settings, as the legacy form is the primary Workspace UI.
    return {
      ...rawSettings,
      school: EnterpriseAdapter.mergeNonEmpty(rawSettings?.school, profileNormalized.school),
      identitas: EnterpriseAdapter.mergeNonEmpty(rawSettings?.identitas, profileNormalized.identitas),
      karakteristik: EnterpriseAdapter.mergeNonEmpty(rawSettings?.karakteristik, profileNormalized.karakteristik),
      principal: EnterpriseAdapter.mergeNonEmpty(rawSettings?.principal, EnterpriseAdapter.mergeNonEmpty(profileNormalized.principal, adminNormalized.principal)),
      pesertaDidik: EnterpriseAdapter.mergeNonEmpty(rawSettings?.pesertaDidik, studentNormalized.pesertaDidik),
      administrasi: EnterpriseAdapter.mergeNonEmpty(rawSettings?.administrasi, adminNormalized.administrasi),
      approval: EnterpriseAdapter.mergeNonEmpty(rawSettings?.approval, adminNormalized.approval),
      pengawas: EnterpriseAdapter.mergeNonEmpty(rawSettings?.pengawas, adminNormalized.pengawas),
      kepalaDinas: EnterpriseAdapter.mergeNonEmpty(rawSettings?.kepalaDinas, adminNormalized.kepalaDinas),
      komite: EnterpriseAdapter.mergeNonEmpty(rawSettings?.komite, adminNormalized.komite),
      
      // Map curriculum prioritizing modular settings over legacy Workspace settings if both exist
      learningLoad: rawSettings?.curriculum?.learningLoad || rawSettings?.learningLoad,
      learningOrganization: rawSettings?.curriculum?.learningOrganization || rawSettings?.learningOrganization,
      intracurricular: rawSettings?.curriculum?.intracurricular || rawSettings?.intracurricular,
      cocurricular: rawSettings?.curriculum?.cocurricular || rawSettings?.cocurricular,
      extracurricular: rawSettings?.curriculum?.extracurricular || rawSettings?.extracurricular,
      academicCalendar: rawSettings?.curriculum?.academicCalendar || rawSettings?.academicCalendar || rawSettings?.kalenderPendidikan,
      learningPolicy: rawSettings?.learningPolicy || undefined,
      evaluation: rawSettings?.evaluation || undefined,
    };
  }
}
