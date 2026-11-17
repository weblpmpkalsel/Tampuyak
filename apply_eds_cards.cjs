const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

code = code.replace(
  'bg-white border-t-4 border-blue-800 rounded-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 border-x border-b border-slate-300',
  'bg-[var(--color-eds-card)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-eds-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-10'
);

code = code.replace(
  'bg-slate-50 border border-slate-300 p-6 rounded-md text-center w-full md:w-72 shrink-0 cursor-pointer hover:bg-slate-100 hover:border-blue-300 transition-colors',
  'bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] p-6 rounded-2xl text-center w-full md:w-72 shrink-0 cursor-pointer hover:shadow-md transition-all'
);

code = code.replace(
  /bg-white rounded-md border border-slate-300 shadow-sm/g,
  'bg-[var(--color-eds-card)] rounded-2xl border border-[var(--color-eds-border)] shadow-[0_2px_10px_rgb(0,0,0,0.02)]'
);

code = code.replace(
  /hover:border-blue-400 hover:shadow-md/g,
  'hover:border-[var(--color-eds-primary)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1'
);

code = code.replace(
  /bg-white border border-slate-300 rounded-md shadow-sm/g,
  'bg-[var(--color-eds-card)] border border-[var(--color-eds-border)] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)]'
);

code = code.replace(
  /rounded-md/g,
  'rounded-xl'
);

code = code.replace(
  /text-blue-700/g,
  'text-[var(--color-eds-primary)]'
);

code = code.replace(
  /bg-blue-50/g,
  'bg-[var(--color-eds-bg)]'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Cards EDS applied');
