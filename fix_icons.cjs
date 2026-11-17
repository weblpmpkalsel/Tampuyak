const fs = require('fs');
const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/Youtube\\n  Maximize,\\n  Bold,\\n  Italic,\\n  Underline,\\n} from "lucide-react";/, 'Youtube,\\n  Maximize,\\n  Bold,\\n  Italic,\\n  Underline\\n} from "lucide-react";');
code = code.replace(/Youtube\\\\n  Maximize,\\\\n  Bold,\\\\n  Italic,\\\\n  Underline,\\\\n} from "lucide-react";/, 'Youtube,\\n  Maximize,\\n  Bold,\\n  Italic,\\n  Underline\\n} from "lucide-react";');

fs.writeFileSync(file, code);
console.log("Fixed icons");
