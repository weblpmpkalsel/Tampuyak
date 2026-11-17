const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Container
code = code.replace(
  'className="min-h-screen bg-slate-100 print:hidden text-slate-900 font-sans selection:bg-blue-600/20 selection:text-blue-900 flex overflow-hidden"',
  'className="min-h-screen bg-[var(--color-eds-bg)] print:hidden text-[var(--color-eds-text-primary)] font-sans selection:bg-[var(--color-eds-primary)] selection:text-white flex overflow-hidden"'
);

// Sidebar
code = code.replace(
  'className="w-64 bg-white border-r border-slate-300 flex flex-col fixed h-full z-30 transition-all print:hidden"',
  'className="w-[260px] bg-[var(--color-eds-card)] border-r border-[var(--color-eds-border)] flex flex-col fixed h-full z-30 transition-all print:hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]"'
);

// Sidebar logo area
code = code.replace(
  'className="h-16 flex items-center px-6 border-b border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors"',
  'className="h-[72px] flex items-center px-6 border-b border-[var(--color-eds-border)] cursor-pointer hover:bg-[var(--color-eds-bg)] transition-colors"'
);

// Main area ml-60 -> ml-[260px]
code = code.replace(
  'className="flex-1 ml-60 print:ml-0 flex flex-col min-h-screen relative print:block print:min-h-0"',
  'className="flex-1 ml-[260px] print:ml-0 flex flex-col min-h-screen relative print:block print:min-h-0"'
);

// Replace default navigation buttons
const buttonRegex = /className=\{\`w-full flex items-center px-3 py-2\.5 rounded-md text-\[14px\] font-bold transition-all duration-300 \$\{(.*?)\} \? "bg-blue-50 border-l-4 border-blue-700 text-blue-800 rounded-none rounded-r-lg shadow-sm font-semibold" : "text-slate-700 hover:bg-slate-100 border-l-4 border-transparent font-medium rounded-none rounded-r-lg"\}\`/g;

code = code.replace(buttonRegex, (match, condition) => {
  return `className={\`w-full flex items-center px-3 py-2.5 mx-2 my-0.5 text-[14px] transition-all duration-200 rounded-xl \${${condition} ? "bg-[var(--color-eds-bg)] text-[var(--color-eds-primary)] font-bold shadow-sm" : "text-[var(--color-eds-text-secondary)] hover:bg-[var(--color-eds-bg)] hover:text-[var(--color-eds-text-primary)] font-medium"}\` style={{ width: "calc(100% - 16px)" }}`;
});

// Fix inner icons for those buttons
const iconRegex = /className=\{\`w-5 h-5 mr-4 \$\{(.*?)\} \? "text-blue-700" : "text-slate-600"\}\`/g;
code = code.replace(iconRegex, (match, condition) => {
  return `className={\`w-5 h-5 mr-3 \${${condition} ? "text-[var(--color-eds-primary)]" : "text-slate-400"}\`}`;
});

// Update Sertifikasi Mutu button
code = code.replace(
  'className={`w-full flex items-center px-4 py-3 text-base transition-all duration-200 ${currentView === "dqaEngine" ? "bg-emerald-700 text-white font-bold" : "text-emerald-800 hover:bg-emerald-100 font-medium"}`}',
  'className={`w-full flex items-center px-3 py-2.5 mx-2 my-0.5 text-[14px] transition-all duration-200 rounded-xl ${currentView === "dqaEngine" ? "bg-[var(--color-eds-success)] text-white font-bold shadow-md shadow-green-600/20" : "text-[var(--color-eds-success)] hover:bg-green-50 font-medium"}`} style={{ width: "calc(100% - 16px)" }}'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Sidebar EDS applied');
