const fs = require('fs');
let code = fs.readFileSync('src/control/ControlCenter.tsx', 'utf8');
const target = `<span className={\`text-xs font-bold px-2.5 py-1 rounded-full \${
                            u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            u.status === 'DISABLED' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }\`}>`;

const replacement = `<span className={\`text-xs font-bold px-2.5 py-1 rounded-full \${
                            u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            u.status === 'DISABLED' ? 'bg-red-100 text-red-700' :
                            u.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }\`}>`;

if (code.includes(target)) {
  fs.writeFileSync('src/control/ControlCenter.tsx', code.replace(target, replacement));
  console.log("Success");
} else {
  console.log("Target not found");
}
