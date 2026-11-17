const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/ui/SupervisionInstrumentSelection.tsx', 'utf8');

content = content.replace(
  "    </>\n  );\n};",
  "    </>\n    </PermissionGuard>\n  );\n};"
);

fs.writeFileSync('src/modules/supervision/ui/SupervisionInstrumentSelection.tsx', content);
