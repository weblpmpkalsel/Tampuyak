import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace displayed parser mode
content = content.replace(/\{pendingImport\.metadata\.parserMode\}/g, "{pendingImport.metadata.parserMode === 'Official' ? 'Resmi' : 'Kompatibilitas'}");
content = content.replace(/Mode: \{hist\.parserMode\}/g, "Mode: {hist.parserMode === 'Official' ? 'Resmi' : 'Kompatibilitas'}");

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed parser texts in UI');
