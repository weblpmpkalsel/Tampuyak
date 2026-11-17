const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const importStatement = "import { seedUatScenario } from './modules/supervision/persistence/firestore/UatSeeder';\n";
file = importStatement + file;

const buttonCode = `<Button onClick={async () => {
            try {
              await seedUatScenario();
              alert("Data Supervisi UAT berhasil digenerate!");
            } catch (e) {
              alert("Gagal: " + e.message);
            }
          }} variant="outline" className="justify-start text-left text-emerald-700 border-emerald-300 bg-emerald-50">15. Generate UAT Data (Supervisi)</Button>`;

file = file.replace(
  `<Button onClick={() => navigateToView("supervisiAkademik")} variant="outline" className="justify-start text-left">14. Supervision</Button>`,
  `<Button onClick={() => navigateToView("supervisiAkademik")} variant="outline" className="justify-start text-left">14. Supervision</Button>\n          ${buttonCode}`
);

fs.writeFileSync('src/Tampuyak.tsx', file);
