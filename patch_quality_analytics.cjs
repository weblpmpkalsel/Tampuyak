const fs = require('fs');
const file = 'src/modules/supervision/application/QualityAnalyticsService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "import { \n  SupervisionPlan,",
  "import { \n  SupervisionPlan,\n  Observation,"
);

code = code.replace(
  "public calculateObservationStatistics(\n    sessions: ObservationSession[]",
  "public calculateObservationStatistics(\n    observations: Observation[]"
);

code = code.replace(
  "sessions.forEach(session => {",
  "observations.forEach(obs => {"
);

code = code.replace(
  /session\.scores/g,
  "obs.scores"
);

code = code.replace(
  /session\.overallScore/g,
  "obs.finalScoreCategory" // Wait, is there an overall score?
);

fs.writeFileSync(file, code);
