const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/application/SupervisionApplicationService.ts', 'utf8');

// 1. Import ISupervisionRepositoryFactory
if (!content.includes('ISupervisionRepositoryFactory')) {
  content = content.replace(
    "import {",
    "import { ISupervisionRepositoryFactory } from '../persistence/ISupervisionRepositories';\nimport {"
  );
}

// 2. Add constructor
if (!content.includes('constructor(')) {
  content = content.replace(
    'export class SupervisionApplicationService {',
    'export class SupervisionApplicationService {\n  constructor(private repositories: ISupervisionRepositoryFactory) {}'
  );
}

fs.writeFileSync('src/modules/supervision/application/SupervisionApplicationService.ts', content);
console.log('Refactored SupervisionApplicationService.ts');
