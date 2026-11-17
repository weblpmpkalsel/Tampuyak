const fs = require('fs');
const file = 'src/workspace/contracts/WorkspaceContractMapper.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('mapWorkspaceToEnterprise')) {
content += `\n
export function mapWorkspaceToEnterprise(rawSettings: any, currentEnterpriseMetadata: KspMetadata): KspMetadata {
  const schoolLevel = rawSettings?.school?.level || 'SD';
  let phase = 'Fase A/B/C';
  if (schoolLevel === 'PAUD') phase = 'Fase Fondasi';
  else if (schoolLevel === 'SMP') phase = 'Fase D';
  else if (schoolLevel === 'SMA' || schoolLevel === 'SMK') phase = 'Fase E/F';
  else if (schoolLevel === 'SLB') phase = 'Fase Pendidikan Khusus';

  let mapped = {
    ...currentEnterpriseMetadata,
    phase
  };

  if (schoolLevel === 'PAUD' && rawSettings?.enterpriseProfile?.paudMetadata) {
    mapped = mapPaudWorkspaceToEnterprise(rawSettings.enterpriseProfile.paudMetadata, mapped);
  } else if (schoolLevel === 'Kesetaraan' && rawSettings?.enterpriseProfile?.kesetaraanMetadata) {
    mapped = mapKesetaraanWorkspaceToEnterprise(rawSettings.enterpriseProfile.kesetaraanMetadata, mapped);
  }

  return mapped;
}
`;
fs.writeFileSync(file, content);
console.log('mapper updated');
} else {
  console.log('already has mapWorkspaceToEnterprise');
}
