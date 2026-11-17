const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const oldKesehatan = `<div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 absolute inset-0"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  healthScore >= 80
                    ? "#059669"
                    : healthScore >= 50
                      ? "#d97706"
                      : "#e11d48"
                }
                strokeWidth="4"
                strokeDasharray={\`\${healthScore}, 100\`}
              />
            </svg>
            <span className="text-4xl font-bold text-slate-900">{healthScore}</span>
          </div>`;

const newKesehatan = `<div className="mb-4">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-slate-900">{healthScore}</span>
              <span className="text-sm font-semibold text-slate-600">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-sm h-3 overflow-hidden">
              <div 
                className={\`h-full \${healthScore >= 80 ? 'bg-emerald-600' : healthScore >= 50 ? 'bg-amber-500' : 'bg-rose-600'}\`} 
                style={{ width: \`\${healthScore}%\` }}
              ></div>
            </div>
          </div>`;

code = code.replace(oldKesehatan, newKesehatan);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done script 7');
