const fs = require('fs');
let content = fs.readFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', 'utf8');
content = content.replace(/\\nexport class Chapter2Builder \\{/, '\\nexport class Chapter2Builder {');
fs.writeFileSync('src/DocumentCompositionEngine/builders/Chapter2Builder.ts', content);
