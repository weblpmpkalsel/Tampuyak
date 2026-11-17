const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldPageHelpStart = `const PageHelp = ({ title, description, importance, nextStep, regulation, time, checklist, mistakes }: any) => {
  const [isOpen, setIsOpen] = useState(false);`;

const newPageHelpStart = `const PageHelp = ({ title, description, importance, nextStep, regulation, time, checklist, mistakes }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistTotal = checklist ? checklist.length : 0;
  const progressPercent = checklistTotal > 0 ? Math.round((completedCount / checklistTotal) * 100) : 0;
`;

const oldChecklistRender = `{checklist && checklist.length > 0 && (
                    <div className="bg-white/50 p-4 rounded-xl border border-indigo-100/50">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Ceklis Persiapan</h4>
                      <ul className="space-y-1">
                        {checklist.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}`;

const newChecklistRender = `{checklist && checklist.length > 0 && (
                    <div className="bg-white/50 p-4 rounded-xl border border-indigo-100/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Ceklis Persiapan</h4>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{progressPercent}% Siap</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: \`\${progressPercent}%\` }}></div>
                      </div>
                      <ul className="space-y-2">
                        {checklist.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => setCheckedItems(prev => ({...prev, [i]: !prev[i]}))}>
                            <div className={\`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors \${checkedItems[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}\`}>
                              {checkedItems[i] && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className={\`transition-colors \${checkedItems[i] ? 'text-slate-400 line-through' : 'text-slate-700'}\`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}`;

if (content.includes(oldPageHelpStart)) {
  content = content.replace(oldPageHelpStart, newPageHelpStart);
}
if (content.includes(oldChecklistRender)) {
  content = content.replace(oldChecklistRender, newChecklistRender);
}

fs.writeFileSync('src/Tampuyak.tsx', content);
