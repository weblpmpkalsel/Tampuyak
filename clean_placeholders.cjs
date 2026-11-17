const fs = require('fs');

function removeLineContaining(file, str) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let newLines = lines.filter(line => !line.includes(str));
    if (lines.length !== newLines.length) {
      fs.writeFileSync(file, newLines.join('\n'));
      console.log(`Cleaned ${file}`);
    }
  }
}

removeLineContaining('src/enterprise/publishing/plugins/pdf/PdfPublisher.ts', 'canonical mock result');
removeLineContaining('src/core/narrative/NarrativeEngine.ts', 'Placeholder');
removeLineContaining('src/core/narrative/diagnostics/NarrativeDiagnosticsEngine.ts', 'Placeholder');
removeLineContaining('src/recommendation/RecommendationRules.ts', 'Placeholder');

// For Tampuyak.tsx mockDocumentContent
const tampuyak = 'src/Tampuyak.tsx';
if (fs.existsSync(tampuyak)) {
  let content = fs.readFileSync(tampuyak, 'utf8');
  content = content.replace(/const mockDocumentContent = \{[\s\S]*?\};\n\n    const result = RegulationComplianceEngine\.checkCompliance\([\s\S]*?mockDocumentContent,[\s\S]*?\);/g, 
    `const result = RegulationComplianceEngine.checkCompliance("PERENCANAAN", { text: "", programs: [] }, settings);`);
  fs.writeFileSync(tampuyak, content);
}
