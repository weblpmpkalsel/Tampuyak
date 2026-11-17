const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/context/SupervisionProvider.tsx', 'utf8');

if (!content.includes('seedInstruments')) {
  content = content.replace(
    "import { SupervisionRepositoryFactory } from '../persistence/SupervisionRepositoryFactory';",
    "import { SupervisionRepositoryFactory } from '../persistence/SupervisionRepositoryFactory';\nimport { seedInstruments } from '../persistence/firestore/SupervisionSeeder';\nimport { useEffect } from 'react';"
  );
  
  content = content.replace(
    "  const value = useMemo(() => ({ state, dispatch, applicationService, repositories }), [state, applicationService, repositories]);",
    "  const value = useMemo(() => ({ state, dispatch, applicationService, repositories }), [state, applicationService, repositories]);\n\n  useEffect(() => {\n    seedInstruments().catch(console.error);\n  }, []);\n"
  );
  
  fs.writeFileSync('src/modules/supervision/context/SupervisionProvider.tsx', content);
  console.log('Added seeding to Provider');
}
