const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(
  /<RKTDerivationView navigateToView={setCurrentView} \/>/g,
  '<RKTDerivationView navigateToView={setCurrentView} updateSetting={updateSetting} />'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
