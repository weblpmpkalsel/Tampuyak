import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const DataSyncRule: ComplianceRule = {
  id: 'ECE-004',
  title: 'Data Sync',
  category: 'Synchronization',
  severity: 'Recommendation',
  appliesTo: 'KSP',
  recommendation: 'Lakukan sinkronisasi ulang Rapor Pendidikan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const lastSyncDate = context.metadata?.raporPendidikan?.lastSync;
    const daysSinceSync = lastSyncDate ? Math.floor((Date.now() - new Date(lastSyncDate).getTime()) / (1000 * 3600 * 24)) : 30;
    
    if (daysSinceSync >= 30) {
      return {
        issueId: `ISSUE-${Date.now()}-ECE-004`,
        ruleId: 'ECE-004',
        severity: 'Recommendation',
        title: 'Data Sync',
        description: 'Rapor Pendidikan terakhir disinkronkan 30 hari yang lalu',
        affectedModule: 'KSP',
        affectedSection: 'Integrasi',
        recommendation: 'Lakukan sinkronisasi ulang Rapor Pendidikan.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
