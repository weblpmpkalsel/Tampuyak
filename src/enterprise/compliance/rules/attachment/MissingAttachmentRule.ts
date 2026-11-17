import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const MissingAttachmentRule: ComplianceRule = {
  id: 'ECE-001',
  title: 'SK Penetapan Kalender Pendidikan',
  category: 'Attachment',
  severity: 'Attachment Required',
  appliesTo: 'KSP',
  recommendation: 'Required before final school approval. Unggah lampiran SK Penetapan Kalender Pendidikan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const hasCalendarAttachment = !!context.metadata?.academicCalendar?.attachmentUrl || !!context.metadata?.attachments?.kalenderPendidikan;
    
    if (!hasCalendarAttachment) {
      return {
        issueId: `ISSUE-${Date.now()}-ECE-001`,
        ruleId: 'ECE-001',
        severity: 'Attachment Required',
        title: 'SK Penetapan Kalender Pendidikan',
        description: 'SK Penetapan Kalender Pendidikan tingkat satuan pendidikan wajib dilampirkan.',
        affectedModule: 'KSP',
        affectedSection: 'Lampiran',
        recommendation: 'Required before final school approval. Unggah lampiran SK Penetapan Kalender Pendidikan.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
