const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex6 = /\{healthChecks\.map\(c => \([\s\S]*?\)\)\}/;
const replacement6 = `{healthChecks.filter(c => c.type !== "optional").map(c => (
                    <div key={c.id} className="flex items-center justify-between text-sm">
                      <span className={c.valid ? "text-slate-700" : (c.type === "mandatory" || c.type === "certification_only" ? "text-rose-600 font-medium" : "text-amber-600 font-medium")}>
                        {c.label} {c.type === "recommended" && "(Rec.)"}
                      </span>
                      {c.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : (c.type === "mandatory" || c.type === "certification_only" ? <XCircle className="w-4 h-4 text-rose-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />)}
                    </div>
                  ))}`;

code = code.replace(regex6, replacement6);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Updated healthchecks UI');
