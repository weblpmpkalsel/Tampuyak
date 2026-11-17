import fs from 'fs';
const file = 'src/enterprise/document/ksp/KspDocumentAssembler.ts';
let content = fs.readFileSync(file, 'utf8');

// add import for buildTeamSection
content = content.replace(
  "import { buildKspApprovalSection } from './approval/KspApprovalStructure';",
  "import { buildKspApprovalSection } from './approval/KspApprovalStructure';\nimport { buildTeamSection } from '../frontmatter/TeamBuilder';"
);

// get the section array and add teamSection
content = content.replace(
  "  const tocSection = buildKspTocSection([\n    coverSection,\n    approvalSection,\n",
  "  const teamSection = buildTeamSection({\n    documentId: 'KSP-001',\n    title: 'Kurikulum Satuan Pendidikan',\n    version: '1.0.0',\n    createdAt: new Date().toISOString(),\n    draftingTeam: metadata.draftingTeam\n  });\n\n  const tocSection = buildKspTocSection([\n    coverSection,\n    approvalSection,\n    teamSection,\n"
);

// also in the final sections array
content = content.replace(
  "  const sections = [\n    coverSection,\n    approvalSection,\n    tocSection,\n",
  "  const sections = [\n    coverSection,\n    approvalSection,\n    teamSection,\n    tocSection,\n"
);

// update the metadata of the document to include the draftingTeam
content = content.replace(
  "      createdAt: new Date().toISOString()\n    },",
  "      createdAt: new Date().toISOString(),\n      draftingTeam: metadata.draftingTeam\n    },"
);

fs.writeFileSync(file, content);
