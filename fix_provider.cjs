const fs = require('fs');
let content = fs.readFileSync('src/modules/supervision/context/SupervisionProvider.tsx', 'utf8');

content = content.replace(
  "  const applicationService = useMemo(() => new SupervisionApplicationService(repositories), [repositories]);\n  const repositories = useMemo(() => SupervisionRepositoryFactory.getInstance(), []);",
  "  const repositories = useMemo(() => SupervisionRepositoryFactory.getInstance(), []);\n  const applicationService = useMemo(() => new SupervisionApplicationService(repositories), [repositories]);"
);

fs.writeFileSync('src/modules/supervision/context/SupervisionProvider.tsx', content);
