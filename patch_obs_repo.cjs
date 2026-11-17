const fs = require('fs');
const file = 'src/modules/supervision/persistence/mock/MockObservationRepository.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "async findByScheduleId",
  "async findAll(): Promise<Observation[]> {\n    return Array.from(mockObservations.values());\n  }\n\n  async findByScheduleId"
);

fs.writeFileSync(file, code);
