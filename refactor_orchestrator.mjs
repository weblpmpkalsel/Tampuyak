import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/Content Orchestrator/g, 'Penggabung Dokumen');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed Orchestrator');
