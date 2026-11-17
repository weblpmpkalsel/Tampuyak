import { TemplateType } from '../document/resolver/EducationTemplateResolver';
import { assemblePaudDocument } from '../document/ksp/paud/PaudDocumentAssembler';
import { assembleKesetaraanDocument } from '../document/ksp/kesetaraan/KesetaraanDocumentAssembler';

export interface EnterpriseTemplate {
  readonly id: string;
  readonly type: TemplateType;
  readonly name: string;
  readonly description: string;
  readonly assembler: any; // The document assembler function
}

/**
 * Enterprise Rule: EnterpriseTemplateLibrary manages the registration of templates.
 */
export class EnterpriseTemplateLibrary {
  private static templates = new Map<TemplateType, EnterpriseTemplate>();
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;
    
    this.register({
      id: 'ksp-paud',
      type: 'TEMPLATE_PAUD',
      name: 'KSP PAUD',
      description: 'Kurikulum Satuan Pendidikan untuk PAUD',
      assembler: assemblePaudDocument
    });

    this.register({
      id: 'ksp-kesetaraan',
      type: 'TEMPLATE_KESETARAAN',
      name: 'KSP Kesetaraan',
      description: 'Kurikulum Satuan Pendidikan untuk Kesetaraan',
      assembler: assembleKesetaraanDocument
    });

    this.initialized = true;
  }

  public static register(template: EnterpriseTemplate): void {
    this.templates.set(template.type, template);
  }

  public static getTemplate(type: TemplateType): EnterpriseTemplate | undefined {
    this.initialize();
    return this.templates.get(type);
  }

  public static getAllTemplates(): EnterpriseTemplate[] {
    this.initialize();
    return Array.from(this.templates.values());
  }
}
