const fs = require('fs');
const file = 'src/modules/supervision/persistence/mock/MockPostObservationRepository.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "async findByScheduleId",
  "async findAll(): Promise<PostObservation[]> {\n    return Array.from(mockPostObservations.values());\n  }\n\n  async findByScheduleId"
);

fs.writeFileSync(file, code);
