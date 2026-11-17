const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/adapters/EnterpriseAdapter.ts', 'utf8');

code = code.replace(
  `      principal: EnterpriseAdapter.mergeNonEmpty(rawSettings?.principal, profileNormalized.principal),`,
  `      principal: EnterpriseAdapter.mergeNonEmpty(rawSettings?.principal, EnterpriseAdapter.mergeNonEmpty(profileNormalized.principal, adminNormalized.principal)),`
);

fs.writeFileSync('src/enterprise/workspace/adapters/EnterpriseAdapter.ts', code);
console.log("Patched EnterpriseAdapter for principal");
