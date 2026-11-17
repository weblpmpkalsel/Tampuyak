const fs = require('fs');
const file = '/app/applet/src/enterprise/document/ksp/bab3/KspBab3Structure.ts';
let code = fs.readFileSync(file, 'utf8');

// Add helper function
const helper = `\nfunction normalizePhaseLabel(phase: string): string {
  if (!phase) return '';
  const trimmed = phase.trim();
  if (trimmed.toLowerCase().startsWith('fase')) {
    return trimmed;
  }
  return \`Fase \${trimmed}\`;
}\n`;

code = code.replace("function generateLearningLoadRows", helper + "\nfunction generateLearningLoadRows");

// Replace the two occurrences
code = code.replace(
  /\(Fase \$\{structurePayload\.payload\.phase\}\)/g,
  "(${normalizePhaseLabel(structurePayload.payload.phase)})"
);

code = code.replace(
  /\(Fase \$\{learningLoadPayload\.payload\.phase\}\)/g,
  "(${normalizePhaseLabel(learningLoadPayload.payload.phase)})"
);

fs.writeFileSync(file, code);
console.log("Patched successfully.");
