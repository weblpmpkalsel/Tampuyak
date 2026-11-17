const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionPublishingView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\\\`/g, "`");
code = code.replace(/\\\$/g, "$");

fs.writeFileSync(file, code);
