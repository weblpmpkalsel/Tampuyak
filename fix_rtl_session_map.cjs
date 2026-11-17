const fs = require('fs');
const file = 'src/modules/supervision/ui/SupervisionRtlSession.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?<\/div>[\s]*?\)\]/m;
// Let's just use string replace for the whole map function

code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?\{followUp\.actionPlans\.map\(ap => \([\s\S]*?\}\)\]/m,
  "nothing"
);

// Actually, I can use multi_edit_file to replace the exact target.
