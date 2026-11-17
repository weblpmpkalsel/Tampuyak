const fs = require('fs');
let file = fs.readFileSync('src/enterprise/document/ksp/bab1/KspBab1Structure.ts', 'utf8');

file = file.replace(
  "text: 'Tabel 1.2 Jumlah Murid ${profile.schoolLevel || profile.educationStage || \"SD\"} Tahun Ajaran'",
  "text: `Tabel 1.2 Jumlah Murid ${profile.schoolLevel || profile.educationStage || 'SD'} Tahun Ajaran`"
);

fs.writeFileSync('src/enterprise/document/ksp/bab1/KspBab1Structure.ts', file);
