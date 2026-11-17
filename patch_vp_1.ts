import fs from 'fs';

const issuePath = 'src/enterprise/compliance/contracts/ComplianceIssue.ts';
let issueCode = fs.readFileSync(issuePath, 'utf8');
issueCode = issueCode.replace(
  /export type Severity = 'Blocking' \| 'Quality' \| 'Recommendation';/,
  "export type Severity = 'Blocking' | 'Quality' | 'Recommendation' | 'Attachment Required';"
);
fs.writeFileSync(issuePath, issueCode);

const panelPath = 'src/ksp/KSPValidationPanel.tsx';
let panelCode = fs.readFileSync(panelPath, 'utf8');
panelCode = panelCode.replace(
`  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Blocking': return 'bg-rose-50 border-rose-500 text-rose-900';
      case 'Quality': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'Recommendation': return 'bg-blue-50 border-blue-500 text-blue-900';
      default: return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };`,
`  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Blocking': return 'bg-rose-50 border-rose-500 text-rose-900';
      case 'Quality': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'Attachment Required': return 'bg-purple-50 border-purple-500 text-purple-900';
      case 'Recommendation': return 'bg-blue-50 border-blue-500 text-blue-900';
      default: return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };`
);
panelCode = panelCode.replace(
`  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Blocking': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'Quality': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'Recommendation': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };`,
`  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Blocking': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'Quality': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'Attachment Required': return <AlertTriangle className="w-5 h-5 text-purple-600" />;
      case 'Recommendation': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };`
);
fs.writeFileSync(panelPath, panelCode);

const missingAttachmentPath = 'src/enterprise/compliance/rules/attachment/MissingAttachmentRule.ts';
let missingAttCode = fs.readFileSync(missingAttachmentPath, 'utf8');
missingAttCode = missingAttCode.replace(
  /severity: 'Blocking'/g,
  "severity: 'Attachment Required'"
);
// Also update description if needed, although the prompt says "Display only 'Required before final school approval.' for attachment-only rules." inside validation UI? Wait:
// "These SHALL NEVER block Print PDF DOCX Display only 'Required before final school approval.'"
// Let's just append it to the description or recommendation.
// "recommendation: 'Required before final school approval.'"
missingAttCode = missingAttCode.replace(
  /recommendation: 'Unggah lampiran SK Penetapan Kalender Pendidikan\.'/g,
  "recommendation: 'Required before final school approval. Unggah lampiran SK Penetapan Kalender Pendidikan.'"
);
fs.writeFileSync(missingAttachmentPath, missingAttCode);

const publishReadinessPath = 'src/ksp/PublishReadinessPanel.tsx';
if (fs.existsSync(publishReadinessPath)) {
  let readinessCode = fs.readFileSync(publishReadinessPath, 'utf8');
  readinessCode = readinessCode.replace(
    /\.filter\(\(issue: ComplianceIssue\) => issue\.severity === 'Blocking' \|\| issue\.severity === 'Quality'\)/g,
    ".filter((issue: ComplianceIssue) => issue.severity === 'Blocking' || issue.severity === 'Quality' || issue.severity === 'Attachment Required')"
  );
  readinessCode = readinessCode.replace(
    /status: issue\.severity === 'Blocking' \? 'Missing' : 'Incomplete',/g,
    "status: issue.severity === 'Blocking' || issue.severity === 'Attachment Required' ? 'Missing' : 'Incomplete',"
  );
  readinessCode = readinessCode.replace(
    /const allRules = RuleRegistry\.filter\(r => r\.appliesTo === 'KSP' && \(r\.severity === 'Blocking' \|\| r\.severity === 'Quality'\)\);/g,
    "const allRules = RuleRegistry.filter(r => r.appliesTo === 'KSP' && (r.severity === 'Blocking' || r.severity === 'Quality' || r.severity === 'Attachment Required'));"
  );
  fs.writeFileSync(publishReadinessPath, readinessCode);
}
