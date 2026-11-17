const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

code = code.replace(
  'chapter.paragraphs?.forEach(p => {',
  'chapter.paragraphs?.filter(p => p.trim() !== "").forEach(p => {'
);

code = code.replace(
  'section.paragraphs?.forEach(p => {',
  'section.paragraphs?.filter(p => p.trim() !== "").forEach(p => {'
);

fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Patched export paragraphs!");
