const fs = require('fs');
let code = fs.readFileSync('src/RKTDocument/MonitoringBuilder.ts', 'utf-8');

code = code.replace(
  'metadata: { generated: true }',
  'metadata: { generated: true },\n      orientation: "landscape"'
);

fs.writeFileSync('src/RKTDocument/MonitoringBuilder.ts', code);
console.log("RKT Chapter 5 orientation patched!");
