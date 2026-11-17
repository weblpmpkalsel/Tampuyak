const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

code = code.replace(/Underline\\n} from "lucide-react";/, 'Underline,\\n  Award,\\n  Star,\\n  ThumbsUp,\\n  CheckSquare,\\n  ListChecks\\n} from "lucide-react";');
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Updated imports");
