const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionObservationSession.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "type: EvidenceType.PHOTO,",
  "type: EvidenceType.IMAGE,"
);

fs.writeFileSync(file, code);
