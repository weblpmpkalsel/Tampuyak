const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Button
code = code.replace(
  'const baseStyle = "inline-flex items-center justify-center px-5 py-3 text-base font-semibold rounded transition-colors duration-200 outline-none";',
  'const baseStyle = "inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-[14px] font-bold rounded-xl transition-all duration-200 outline-none hover:-translate-y-0.5 active:translate-y-0 active:scale-95";'
);

code = code.replace(
  'primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-sm border border-transparent",',
  'primary: "bg-[var(--color-eds-primary)] text-white hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] border border-transparent",'
);

code = code.replace(
  'secondary: "bg-white text-slate-800 border border-slate-300 shadow-sm hover:bg-slate-50",',
  'secondary: "bg-[var(--color-eds-card)] text-[var(--color-eds-text-primary)] border border-[var(--color-eds-border)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[var(--color-eds-bg)]",'
);

code = code.replace(
  'danger: "bg-white text-red-700 border border-red-300 shadow-sm hover:bg-red-50 hover:border-red-400",',
  'danger: "bg-[var(--color-eds-danger)] text-white shadow-[0_4px_12px_rgba(220,38,38,0.2)] hover:bg-red-700 hover:shadow-[0_6px_16px_rgba(220,38,38,0.3)] border border-transparent",'
);

code = code.replace(
  'outline: "bg-transparent border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50",',
  'outline: "bg-transparent border border-[var(--color-eds-border)] text-[var(--color-eds-text-primary)] hover:border-[var(--color-eds-primary)] hover:bg-[var(--color-eds-bg)] hover:text-[var(--color-eds-primary)] shadow-sm",'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Button EDS applied');
