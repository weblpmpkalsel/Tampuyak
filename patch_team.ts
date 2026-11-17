import fs from 'fs';
const file = 'src/enterprise/document/frontmatter/TeamBuilder.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "'Susunan tim penyusun belum ditetapkan.'",
  "'Data sedang dalam tahap penyusunan.'"
);
fs.writeFileSync(file, content);
