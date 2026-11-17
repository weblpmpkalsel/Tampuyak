const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');

const selectRegex = /<select[\s\S]*?<\/select>/s;
code = code.replace(selectRegex, '<span className="text-sm text-slate-700">{u.role}</span>');

const handlerRegex = /const handleRoleChange = async[\s\S]*?catch \(e\) \{ console\.error\(e\); \}\n  \};\n/s;
code = code.replace(handlerRegex, '');

fs.writeFileSync('src/control/ControlCenter.tsx', code);
