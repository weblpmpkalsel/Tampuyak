const fs = require('fs');
const file = 'src/enterprise/knowledge/builders/SchoolContextBuilder.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "export function buildEducatorCharacteristicDomain(raw?: any): EducatorKnowledgeDomain | undefined {\n  if (!raw) return undefined;\n  return {\n    generalCharacteristics: raw.pendidik ? [raw.pendidik] : undefined\n  };\n}",
  "export function buildEducatorCharacteristicDomain(raw?: any): EducatorKnowledgeDomain | undefined {\n  if (!raw) return undefined;\n  const pendidikText = raw.pendidik || raw.guru;\n  return {\n    generalCharacteristics: pendidikText ? [pendidikText] : undefined\n  };\n}"
);

fs.writeFileSync(file, content);
console.log("Patched");
