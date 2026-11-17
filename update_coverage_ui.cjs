const fs = require('fs');
let code = fs.readFileSync('add_coverage_comp.txt', 'utf8');

const oldStr = \`<h3 className="font-bold text-lg text-slate-800">{cov.chapter}</h3>
                               <p className="text-sm text-slate-500 flex items-center mt-1">
                                 <Link className="w-3 h-3 mr-1" /> Sumber: {cov.sources.join(", ")}
                               </p>\`;

const newStr = \`<h3 className="font-bold text-lg text-slate-800">{cov.chapter}</h3>
                               <div className="mt-2 space-y-1">
                                 <p className="text-xs text-slate-500 flex items-center">
                                   <Database className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Sumber:</span> {cov.sources.join(", ")}
                                 </p>
                                 <p className="text-xs text-slate-500 flex items-center">
                                   <Library className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Modul:</span> {cov.module}
                                 </p>
                                 <p className="text-xs text-slate-500 flex items-center">
                                   <Milestone className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Tahap:</span> {cov.stage}
                                 </p>
                                 <p className="text-xs text-slate-500 flex items-center">
                                   <ShieldCheck className="w-3 h-3 mr-1" /> <span className="w-16 font-medium">Regulasi:</span> {cov.regulation}
                                 </p>
                               </div>\`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('add_coverage_comp.txt', code);
console.log("Updated add_coverage_comp.txt with full mapping UI using string replace.");
