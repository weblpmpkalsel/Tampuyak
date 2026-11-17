import fs from 'fs';

const path = 'src/ksp/PublishReadinessPanel.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /\.filter\(\(issue: ComplianceIssue\) => issue\.severity === 'CRITICAL' \|\| issue\.severity === 'MAJOR'\)/g,
  `.filter((issue: ComplianceIssue) => issue.severity === 'Blocking' || issue.severity === 'Quality')`
);

code = code.replace(
  /status: issue\.severity === 'CRITICAL' \? 'Missing' : 'Incomplete',/g,
  `status: issue.severity === 'Blocking' ? 'Missing' : 'Incomplete',`
);

code = code.replace(
  /const allRules = RuleRegistry\.filter\(r => r\.appliesTo === 'KSP' && \(r\.severity === 'CRITICAL' \|\| r\.severity === 'MAJOR'\)\);/g,
  `const allRules = RuleRegistry.filter(r => r.appliesTo === 'KSP' && (r.severity === 'Blocking' || r.severity === 'Quality'));`
);

fs.writeFileSync(path, code);
