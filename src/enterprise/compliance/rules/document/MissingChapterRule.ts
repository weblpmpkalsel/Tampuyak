import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const MissingChapterRule: ComplianceRule = {
  id: 'ECE-002',
  title: 'Visi, Misi, Tujuan',
  category: 'Document',
  severity: 'Blocking',
  appliesTo: 'KSP',
  recommendation: 'Lengkapi bagian Visi Misi Tujuan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const identitas = context.metadata?.identitas;
    const hasVisionMission = identitas && identitas.visi && identitas.misi && identitas.misi.length > 0;
    
    if (!hasVisionMission) {
      return {
        issueId: `ISSUE-${Date.now()}-ECE-002`,
        ruleId: 'ECE-002',
        severity: 'Blocking',
        title: 'Visi, Misi, Tujuan',
        description: 'Visi dan misi sekolah belum lengkap atau belum direview tahun ini.',
        affectedModule: 'KSP',
        affectedSection: 'BAB II',
        recommendation: 'Lengkapi bagian Visi Misi Tujuan.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
