const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src/enterprise/compliance');

// 1. Create contracts
const issueContent = `
export type Severity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

export interface ComplianceIssue {
  issueId: string;
  ruleId: string;
  severity: Severity;
  title: string;
  description: string;
  affectedModule: string;
  affectedSection: string;
  recommendation: string;
  fixAction?: { type: 'DEEP_LINK' | 'AUTO_FIX'; target: string };
  resolved: boolean;
  timestamp: string;
}
`;
fs.writeFileSync(path.join(srcDir, 'contracts/ComplianceIssue.ts'), issueContent);

const ruleContent = `
import { ComplianceIssue, Severity } from './ComplianceIssue';

export interface ComplianceContext {
  documentType: 'KSP' | 'RKJM' | 'RKT' | 'RKAS';
  metadata: any; 
}

export interface ComplianceRule {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  appliesTo: string;
  recommendation: string;
  validate: (context: ComplianceContext) => ComplianceIssue | null;
}
`;
fs.writeFileSync(path.join(srcDir, 'contracts/ComplianceRule.ts'), ruleContent);

const reportContent = `
import { ComplianceIssue } from './ComplianceIssue';

export interface ComplianceReport {
  timestamp: string;
  complianceScore: number;
  completionScore: number;
  releaseReadiness: boolean;
  issues: ComplianceIssue[];
}
`;
fs.writeFileSync(path.join(srcDir, 'contracts/ComplianceReport.ts'), reportContent);

// Backward compatibility ComplianceTypes.ts
const typesContent = `
export * from './contracts/ComplianceIssue';
export * from './contracts/ComplianceRule';
export * from './contracts/ComplianceReport';
`;
fs.writeFileSync(path.join(srcDir, 'ComplianceTypes.ts'), typesContent);

// 2. Create Rules
const rule1 = `
import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const MissingAttachmentRule: ComplianceRule = {
  id: 'ECE-001',
  title: 'Missing Attachment',
  category: 'Attachment',
  severity: 'CRITICAL',
  appliesTo: 'KSP',
  recommendation: 'Unggah lampiran Kalender Pendidikan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const hasCalendarAttachment = false; 
    if (!hasCalendarAttachment) {
      return {
        issueId: \`ISSUE-\${Date.now()}-ECE-001\`,
        ruleId: 'ECE-001',
        severity: 'CRITICAL',
        title: 'Missing Attachment',
        description: 'Kalender Pendidikan belum diunggah',
        affectedModule: 'KSP',
        affectedSection: 'Lampiran',
        recommendation: 'Unggah lampiran Kalender Pendidikan.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
`;
fs.writeFileSync(path.join(srcDir, 'rules/attachment/MissingAttachmentRule.ts'), rule1);

const rule2 = `
import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const MissingChapterRule: ComplianceRule = {
  id: 'ECE-002',
  title: 'Missing Chapter',
  category: 'Document',
  severity: 'CRITICAL',
  appliesTo: 'KSP',
  recommendation: 'Lengkapi bagian Visi Misi Tujuan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const hasVisionMission = false;
    if (!hasVisionMission) {
      return {
        issueId: \`ISSUE-\${Date.now()}-ECE-002\`,
        ruleId: 'ECE-002',
        severity: 'CRITICAL',
        title: 'Missing Chapter',
        description: 'Visi Misi Tujuan masih kosong',
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
`;
fs.writeFileSync(path.join(srcDir, 'rules/document/MissingChapterRule.ts'), rule2);

const rule3 = `
import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const IncompleteSectionRule: ComplianceRule = {
  id: 'ECE-003',
  title: 'Incomplete Section',
  category: 'Document',
  severity: 'MAJOR',
  appliesTo: 'KSP',
  recommendation: 'Lakukan validasi pada Karakteristik Satuan Pendidikan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const isCharacteristicsValidated = false;
    if (!isCharacteristicsValidated) {
      return {
        issueId: \`ISSUE-\${Date.now()}-ECE-003\`,
        ruleId: 'ECE-003',
        severity: 'MAJOR',
        title: 'Incomplete Section',
        description: 'Karakteristik Satuan Pendidikan belum divalidasi',
        affectedModule: 'KSP',
        affectedSection: 'BAB I',
        recommendation: 'Lakukan validasi pada Karakteristik Satuan Pendidikan.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
`;
fs.writeFileSync(path.join(srcDir, 'rules/document/IncompleteSectionRule.ts'), rule3);

const rule4 = `
import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const DataSyncRule: ComplianceRule = {
  id: 'ECE-004',
  title: 'Data Sync',
  category: 'Synchronization',
  severity: 'MINOR',
  appliesTo: 'KSP',
  recommendation: 'Lakukan sinkronisasi ulang Rapor Pendidikan.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const daysSinceSync = 30;
    if (daysSinceSync >= 30) {
      return {
        issueId: \`ISSUE-\${Date.now()}-ECE-004\`,
        ruleId: 'ECE-004',
        severity: 'MINOR',
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
`;
fs.writeFileSync(path.join(srcDir, 'rules/synchronization/DataSyncRule.ts'), rule4);

const rule5 = `
import { ComplianceRule, ComplianceContext } from '../../contracts/ComplianceRule';
import { ComplianceIssue } from '../../contracts/ComplianceIssue';

export const PendingReviewRule: ComplianceRule = {
  id: 'ECE-005',
  title: 'Pending Review',
  category: 'Publishing',
  severity: 'INFO',
  appliesTo: 'KSP',
  recommendation: 'Minta Kepala Sekolah untuk mereviu draft KSP.',
  validate: (context: ComplianceContext): ComplianceIssue | null => {
    const isReviewed = false;
    if (!isReviewed) {
      return {
        issueId: \`ISSUE-\${Date.now()}-ECE-005\`,
        ruleId: 'ECE-005',
        severity: 'INFO',
        title: 'Pending Review',
        description: 'Draft KSP memerlukan reviu Kepala Sekolah',
        affectedModule: 'KSP',
        affectedSection: 'Persetujuan',
        recommendation: 'Minta Kepala Sekolah untuk mereviu draft KSP.',
        resolved: false,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};
`;
fs.writeFileSync(path.join(srcDir, 'rules/publishing/PendingReviewRule.ts'), rule5);

// 3. New RuleRegistry.ts
const registryContent = `
import { ComplianceRule } from '../contracts/ComplianceRule';
import { MissingAttachmentRule } from '../rules/attachment/MissingAttachmentRule';
import { MissingChapterRule } from '../rules/document/MissingChapterRule';
import { IncompleteSectionRule } from '../rules/document/IncompleteSectionRule';
import { DataSyncRule } from '../rules/synchronization/DataSyncRule';
import { PendingReviewRule } from '../rules/publishing/PendingReviewRule';

export const RuleRegistry: ComplianceRule[] = [
  MissingAttachmentRule,
  MissingChapterRule,
  IncompleteSectionRule,
  DataSyncRule,
  PendingReviewRule
];
`;
fs.writeFileSync(path.join(srcDir, 'registry/RuleRegistry.ts'), registryContent);

// 4. Update Engine
const engineContent = `
import { ComplianceRule, ComplianceContext } from '../contracts/ComplianceRule';
import { ComplianceReport } from '../contracts/ComplianceReport';
import { ComplianceIssue } from '../contracts/ComplianceIssue';
import { RuleRegistry } from '../registry/RuleRegistry';

export class ComplianceEngine {
  private rules: ComplianceRule[] = [];

  constructor() {
    this.rules = [...RuleRegistry];
  }

  public execute(context: ComplianceContext): ComplianceReport {
    const issues: ComplianceIssue[] = [];
    
    for (const rule of this.rules) {
      if (context.documentType === 'KSP' && rule.appliesTo === 'KSP') {
        const issue = rule.validate(context);
        if (issue) {
          issues.push(issue);
        }
      }
    }

    const totalCriticalOrBlocker = this.rules.filter(r => (r.severity === 'CRITICAL' || r.severity === 'BLOCKER') && r.appliesTo === context.documentType).length;
    const failedCriticalOrBlocker = issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'BLOCKER').length;
    
    const complianceScore = totalCriticalOrBlocker > 0 
      ? Math.round(((totalCriticalOrBlocker - failedCriticalOrBlocker) / totalCriticalOrBlocker) * 100) 
      : 100;

    const completionScore = 80;
    const releaseReadiness = failedCriticalOrBlocker === 0;

    return {
      timestamp: new Date().toISOString(),
      complianceScore,
      completionScore,
      releaseReadiness,
      issues
    };
  }
}

export const enterpriseComplianceEngine = new ComplianceEngine();
`;
fs.writeFileSync(path.join(srcDir, 'engine/ComplianceEngine.ts'), engineContent);

// Write backwards-compatible aliases for old files if we need to remove them, 
// actually the engine and registry were inside compliance/ directly before.
// We should remove the old RuleRegistry.ts and ComplianceEngine.ts in src/enterprise/compliance/
fs.unlinkSync(path.join(srcDir, 'RuleRegistry.ts'));
fs.unlinkSync(path.join(srcDir, 'ComplianceEngine.ts'));

console.log('Patched architecture');
