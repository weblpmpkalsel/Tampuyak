const fs = require('fs');

const files = [
  'src/DocumentCompositionEngine/DocumentModel.ts',
  'src/DocumentCompositionEngine.legacy.ts'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\s*pageBreak\?: boolean;/g, '');
  content = content.replace(/\s*orientation\?: "portrait" \| "landscape";/g, '');
  fs.writeFileSync(file, content);
}
