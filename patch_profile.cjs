const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/modules/ProfileModule.tsx', 'utf8');

code = code.replace(
  `  const profile = settings?.enterpriseProfile || {};
  const identity = profile.identity || { npsn: '', name: '', address: '', principalName: '', status: 'Negeri', accreditation: 'A' };
  const vision = profile.vision || '';
  const mission = profile.mission || [''];
  const goals = profile.goals || [''];
  const characteristics = profile.characteristics || {
    lokasi: [],
    lingkungan: '',
    pesertaDidik: '',
    pendidik: '',
    orangTua: ''
  };`,
  `  const profile = settings?.enterpriseProfile || {};
  const identity = profile.identity || { 
    npsn: settings?.school?.npsn || '', 
    name: settings?.school?.name || '', 
    address: settings?.school?.address || '', 
    principalName: settings?.principal?.name || '', 
    status: settings?.school?.status || 'Negeri', 
    accreditation: settings?.school?.akreditasi || 'Belum Terakreditasi' 
  };
  const vision = profile.vision || settings?.identitas?.visi || '';
  const mission = profile.mission || (settings?.identitas?.misi?.length > 0 ? settings?.identitas?.misi : ['']);
  const goals = profile.goals || (settings?.identitas?.tujuan?.length > 0 ? settings?.identitas?.tujuan : ['']);
  const characteristics = profile.characteristics || {
    lokasi: settings?.potensi?.daerah || [],
    lingkungan: settings?.karakteristik?.sosialBudaya || '',
    pesertaDidik: settings?.karakteristik?.pesertaDidik || '',
    pendidik: settings?.karakteristik?.pendidik || '',
    orangTua: settings?.karakteristik?.kondisiNyata || ''
  };`
);

fs.writeFileSync('src/enterprise/workspace/modules/ProfileModule.tsx', code);
console.log("Patched ProfileModule");
