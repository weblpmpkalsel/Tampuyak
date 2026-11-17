export type EducationType = 'PAUD' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB' | 'KESETARAAN';

export type TemplateType = 'TEMPLATE_SD' | 'TEMPLATE_SMP' | 'TEMPLATE_SMA' | 'TEMPLATE_SMK' | 'TEMPLATE_SLB' | 'TEMPLATE_PAUD' | 'TEMPLATE_KESETARAAN' | 'NOT_IMPLEMENTED';

export class EducationTemplateResolver {
  /**
   * Resolves the appropriate document template based on the school's education type.
   * 
   * CURRENT MAPPING (M1.1 SAFE MODE):
   * - SD -> TEMPLATE_SD
   * - SMP -> TEMPLATE_SMP
   * - SMA -> TEMPLATE_SD (fallback)
   * - SMK -> TEMPLATE_SD (fallback)
   * - SLB -> TEMPLATE_SD (fallback)
   * - PAUD -> TEMPLATE_PAUD
   * - KESETARAAN -> TEMPLATE_KESETARAAN
   * 
   * @param educationType The education level/type from the School Profile.
   * @returns The resolved TemplateType to be used by the Enterprise Engine.
   */
  public static resolveTemplate(educationType: EducationType | string): TemplateType {
    const normalizedType = educationType?.toString().toUpperCase().trim();

    switch (normalizedType) {
      case 'SD':
        return 'TEMPLATE_SD';
      case 'SMP':
        return 'TEMPLATE_SMP';
      case 'SMA':
        // Fallback to SD template temporarily
        return 'TEMPLATE_SD';
      case 'SMK':
        // Fallback to SD template temporarily
        return 'TEMPLATE_SD';
      case 'SLB':
        // Fallback to SD template temporarily
        return 'TEMPLATE_SD';
      case 'PAUD':
      case 'TK':
      case 'KB':
      case 'SPS':
      case 'TPA':
        return 'TEMPLATE_PAUD';
      case 'KESETARAAN':
      case 'PKBM':
      case 'SKB':
        return 'TEMPLATE_KESETARAAN';
      default:
        // Default safe fallback for unknown types
        return 'TEMPLATE_SD';
    }
  }
}
