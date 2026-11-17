import fs from 'fs';
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace PrePrintValidationEngine reference
content = content.replace(/PrePrintValidationEngine/g, 'EnterpriseValidationEngine');

// In DocumentHealthScore, the status calculation can use the EVE object.
content = content.replace(
  /const validRes = EnterpriseValidationEngine.validateDocument\(docId, settings\);\n\s*const healthScore = validRes\.valid \? 100 : Math\.max\(0, 100 - validRes\.errors\.length \* 20\);/,
  `const validRes = EnterpriseValidationEngine.validateDocument(docId, settings);
  const healthScore = validRes.totalCoverage || (validRes.valid ? 100 : Math.max(0, 100 - validRes.errors.length * 20));`
);

const regex = /let coverageData: any\[\] = \[\];[\s\S]*?status: isMonitoringComplete \? "Lengkap" : "Blocked"\n\s*\}\n\s*\];\n\s*\}/;
content = content.replace(regex, `const eveResult = EnterpriseValidationEngine.validateDocument(docId, settings);
  let coverageData = eveResult.chapters;`);

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed usages of EVE');
