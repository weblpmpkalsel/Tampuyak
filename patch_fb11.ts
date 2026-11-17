import fs from 'fs';

const issuePath = 'src/enterprise/compliance/contracts/ComplianceIssue.ts';
let issueCode = fs.readFileSync(issuePath, 'utf8');
issueCode = issueCode.replace(/export type Severity = 'BLOCKER' \| 'CRITICAL' \| 'MAJOR' \| 'MINOR' \| 'INFO';/, "export type Severity = 'Blocking' | 'Quality' | 'Recommendation';");
fs.writeFileSync(issuePath, issueCode);

const panelPath = 'src/ksp/KSPValidationPanel.tsx';
let panelCode = fs.readFileSync(panelPath, 'utf8');
panelCode = panelCode.replace(
`  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'BLOCKER':
      case 'CRITICAL': return 'bg-rose-50 border-rose-500 text-rose-900';
      case 'MAJOR': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'MINOR': return 'bg-amber-50 border-amber-500 text-amber-900';
      default: return 'bg-blue-50 border-blue-500 text-blue-900';
    }
  };`,
`  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Blocking': return 'bg-rose-50 border-rose-500 text-rose-900';
      case 'Quality': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'Recommendation': return 'bg-blue-50 border-blue-500 text-blue-900';
      default: return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };`
);
panelCode = panelCode.replace(
`  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'BLOCKER':
      case 'CRITICAL': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'MAJOR': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'MINOR': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };`,
`  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Blocking': return <AlertOctagon className="w-5 h-5 text-rose-600" />;
      case 'Quality': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'Recommendation': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };`
);
fs.writeFileSync(panelPath, panelCode);

const enginePath = 'src/enterprise/compliance/engine/ComplianceEngine.ts';
let engineCode = fs.readFileSync(enginePath, 'utf8');
engineCode = engineCode.replace(
`    const totalCriticalOrBlocker = this.rules.filter(r => (r.severity === 'CRITICAL' || r.severity === 'BLOCKER') && r.appliesTo === context.documentType).length;
    const failedCriticalOrBlocker = issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'BLOCKER').length;`,
`    const totalCriticalOrBlocker = this.rules.filter(r => r.severity === 'Blocking' && r.appliesTo === context.documentType).length;
    const failedCriticalOrBlocker = issues.filter(i => i.severity === 'Blocking').length;`
);
fs.writeFileSync(enginePath, engineCode);

function replaceSeverity(path: string, oldSeverity: string, newSeverity: string, replacements?: {old: string, new: string}[]) {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(new RegExp(`severity: '${oldSeverity}'`, 'g'), `severity: '${newSeverity}'`);
  if (replacements) {
    replacements.forEach(r => {
      code = code.replace(new RegExp(r.old, 'g'), r.new);
    });
  }
  fs.writeFileSync(path, code);
}

replaceSeverity('src/enterprise/compliance/rules/attachment/MissingAttachmentRule.ts', 'CRITICAL', 'Blocking', [
  {old: "title: 'Kalender Pendidikan'", new: "title: 'SK Penetapan Kalender Pendidikan'"},
  {old: "SK Kalender Pendidikan tingkat satuan pendidikan", new: "SK Penetapan Kalender Pendidikan tingkat satuan pendidikan"},
  {old: "Unggah lampiran Kalender Pendidikan", new: "Unggah lampiran SK Penetapan Kalender Pendidikan"}
]);
replaceSeverity('src/enterprise/compliance/rules/document/MissingChapterRule.ts', 'CRITICAL', 'Blocking');
replaceSeverity('src/enterprise/compliance/rules/document/IncompleteSectionRule.ts', 'MAJOR', 'Quality');
replaceSeverity('src/enterprise/compliance/rules/synchronization/DataSyncRule.ts', 'MINOR', 'Recommendation');
replaceSeverity('src/enterprise/compliance/rules/publishing/PendingReviewRule.ts', 'INFO', 'Recommendation');
