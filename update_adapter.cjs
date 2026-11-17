const fs = require('fs');
const file = 'src/ksp/KspMetadataAdapter.ts';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace(
    "import { EnterpriseAdapter } from '../enterprise/workspace/adapters/EnterpriseAdapter';",
    "import { EnterpriseAdapter } from '../enterprise/workspace/adapters/EnterpriseAdapter';\nimport { mapWorkspaceToEnterprise } from '../workspace/contracts/WorkspaceContractMapper';"
);

// Remove branching
content = content.replace(
    `    const schoolLevel = settings?.school?.level || 'SD';\n    let phase = 'Fase A/B/C';\n    if (schoolLevel === 'PAUD') phase = 'Fase Fondasi';\n    else if (schoolLevel === 'SMP') phase = 'Fase D';\n    else if (schoolLevel === 'SMA' || schoolLevel === 'SMK') phase = 'Fase E/F';\n    else if (schoolLevel === 'SLB') phase = 'Fase Pendidikan Khusus';`,
    `    const schoolLevel = settings?.school?.level || 'SD';\n    let phase = ''; // delegated to WorkspaceContractMapper`
);

// Map return
content = content.replace(
    `    return {\n      schoolName: settings?.school?.name || '',`,
    `    const baseMetadata: KspMetadata = {\n      schoolName: settings?.school?.name || '',`
);

content = content.replace(
    `      rawStrategicPolicy: settings?.identitas ? {\n        vision: settings.identitas.visi || '',\n        mission: settings.identitas.misi || [],\n        goals: settings.identitas.tujuan || []\n      } : undefined,\n    };\n  }`,
    `      rawStrategicPolicy: settings?.identitas ? {\n        vision: settings.identitas.visi || '',\n        mission: settings.identitas.misi || [],\n        goals: settings.identitas.tujuan || []\n      } : undefined,\n    };\n    return mapWorkspaceToEnterprise(rawSettings, baseMetadata);\n  }`
);

fs.writeFileSync(file, content);
console.log('adapter updated');
