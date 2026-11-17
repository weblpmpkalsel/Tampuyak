const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/adapters/EnterpriseProfileAdapter.ts', 'utf8');

code = code.replace(
  `      principal: {
        ...(identity.principalName && { name: identity.principalName }),
      },`,
  `      principal: {
        ...(identity.principalName && { name: identity.principalName }),
        ...(identity.principalNip && { nip: identity.principalNip }),
      },`
);

fs.writeFileSync('src/enterprise/workspace/adapters/EnterpriseProfileAdapter.ts', code);
console.log("Patched NIP in EnterpriseProfileAdapter");
