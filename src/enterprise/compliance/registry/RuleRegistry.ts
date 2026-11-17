
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
