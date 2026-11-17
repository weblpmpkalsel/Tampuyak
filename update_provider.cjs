const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/context/SupervisionProvider.tsx', 'utf8');

content = content.replace(
  "const applicationService = useMemo(() => new SupervisionApplicationService(), []);",
  "const applicationService = useMemo(() => new SupervisionApplicationService(repositories), [repositories]);"
);

fs.writeFileSync('src/modules/supervision/context/SupervisionProvider.tsx', content);
console.log('Refactored SupervisionProvider.tsx');
