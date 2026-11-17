const fs = require('fs');
const file = 'src/modules/supervision/application/SupervisionPublishingService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "<tr><td style=\"padding: 5px 0;\">Fokus Utama</td><td>: ${'-' || '-'}</td></tr>",
  "<tr><td style=\"padding: 5px 0;\">Fokus Utama</td><td>: ${'-'}</td></tr>"
);

fs.writeFileSync(file, code);
