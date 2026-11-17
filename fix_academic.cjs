const fs = require('fs');
let codeAcad = fs.readFileSync('src/modules/supervision/ui/SupervisionAcademicView.tsx', 'utf8');
codeAcad = codeAcad.replace(
  "Object.values(state.schedules.items).find",
  "state.schedules.schedules.find"
);
fs.writeFileSync('src/modules/supervision/ui/SupervisionAcademicView.tsx', codeAcad);
