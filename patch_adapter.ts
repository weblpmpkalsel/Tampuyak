import fs from 'fs';
const file = 'src/ksp/KspMetadataAdapter.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'rawStudents?: any;',
  'rawStudents?: any;\n  draftingTeam?: readonly { name: string; role: string; identifier?: string }[];'
);
content = content.replace(
  'documentNumber: settings?.approval?.documentNumber || \'\',',
  'documentNumber: settings?.approval?.documentNumber || \'\',\n      draftingTeam: settings?.timPenyusun || settings?.draftingTeam || [],'
);
fs.writeFileSync(file, content);
