const fs = require('fs');
let code = fs.readFileSync('src/services/firestore/auditService.ts', 'utf8');

code = code.replace(
  "    if (metadata !== undefined) {\n      log.metadata = metadata;\n    }",
  "    if (metadata) {\n      // Sanitize to remove undefined values\n      const sanitized = JSON.parse(JSON.stringify(metadata));\n      log.metadata = Object.keys(sanitized).length > 0 ? sanitized : {};\n    } else {\n      log.metadata = {};\n    }"
);

fs.writeFileSync('src/services/firestore/auditService.ts', code);
