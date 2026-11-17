const fs = require('fs');

let content = fs.readFileSync('src/modules/supervision/persistence/SupervisionRepositoryFactory.ts', 'utf8');

// Replace mock imports
content = content.replace(
  "import { MockSupervisionRepository } from './mock/MockSupervisionRepository';",
  "import { FirestoreSupervisionRepository } from './firestore/FirestoreSupervisionRepository';"
);
content = content.replace(
  "import { MockScheduleRepository } from './mock/MockScheduleRepository';",
  "import { FirestoreScheduleRepository } from './firestore/FirestoreScheduleRepository';"
);
content = content.replace(
  "import { MockObservationRepository } from './mock/MockObservationRepository';",
  "import { FirestoreObservationRepository } from './firestore/FirestoreObservationRepository';"
);
content = content.replace(
  "import { MockInstrumentRepository } from './mock/MockInstrumentRepository';",
  "import { FirestoreInstrumentRepository } from './firestore/FirestoreInstrumentRepository';"
);
content = content.replace(
  "import { MockPostObservationRepository } from './mock/MockPostObservationRepository';",
  "import { FirestorePostObservationRepository } from './firestore/FirestorePostObservationRepository';"
);
content = content.replace(
  "import { MockFollowUpRepository } from './mock/MockFollowUpRepository';",
  "import { FirestoreFollowUpRepository } from './firestore/FirestoreFollowUpRepository';"
);

// Replace instantiation
content = content.replace(
  "this.supervisionRepository = new MockSupervisionRepository();",
  "this.supervisionRepository = new FirestoreSupervisionRepository();"
);
content = content.replace(
  "this.scheduleRepository = new MockScheduleRepository();",
  "this.scheduleRepository = new FirestoreScheduleRepository();"
);
content = content.replace(
  "this.observationRepository = new MockObservationRepository();",
  "this.observationRepository = new FirestoreObservationRepository();"
);
content = content.replace(
  "this.instrumentRepository = new MockInstrumentRepository();",
  "this.instrumentRepository = new FirestoreInstrumentRepository();"
);
content = content.replace(
  "this.postObservationRepository = new MockPostObservationRepository();",
  "this.postObservationRepository = new FirestorePostObservationRepository();"
);
content = content.replace(
  "this.followUpRepository = new MockFollowUpRepository();",
  "this.followUpRepository = new FirestoreFollowUpRepository();"
);

fs.writeFileSync('src/modules/supervision/persistence/SupervisionRepositoryFactory.ts', content);
console.log('Fixed SupervisionRepositoryFactory.ts');
