const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target = `<select className="text-xs border-r border-slate-200 px-2 py-1 outline-none bg-transparent">
                <option>Times New Roman</option>
                <option>Arial</option>
              </select>`;

const replacement = `<select className="text-xs border-r border-slate-200 px-2 py-1 outline-none bg-transparent">
                <option>Times New Roman</option>
                <option>Arial</option>
              </select>
              {settings?.writingAssistant?.mode !== 'Disabled' && (
                <select className="text-xs border-r border-slate-200 px-2 py-1 outline-none bg-indigo-50 text-indigo-700 font-bold">
                  <option value="">✨ Writing Assistant</option>
                  <option value="improve">Improve Language</option>
                  <option value="formalize">Formalize</option>
                  <option value="expand">Expand</option>
                  <option value="summarize">Summarize</option>
                  <option value="rewrite">Rewrite</option>
                  <option value="gov_style">Official Government Style</option>
                </select>
              )}`;

code = code.replace(target, replacement);

// And we should also look for any place where `✨ AI` is used and change it to `✨ Writing Assistant`
code = code.replace(/✨\s*AI/g, '✨ Writing Assistant');

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Saved');
