const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Header
code = code.replace(
  '<header className="h-20 bg-white border-b border-slate-300 sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm print:hidden">',
  '<header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-[var(--color-eds-border)] sticky top-0 z-20 px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] print:hidden">'
);

// Search input wrapper & input
code = code.replace(
  'className="w-full bg-slate-100/50 border border-slate-300 text-sm rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-600"',
  'className="w-full bg-[var(--color-eds-bg)] border border-[var(--color-eds-border)] text-[14px] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-4 focus:ring-[var(--color-eds-primary)]/10 focus:border-[var(--color-eds-primary)] transition-all font-medium text-[var(--color-eds-text-primary)] placeholder:text-[var(--color-eds-text-secondary)]"'
);

// ⌘K badge
code = code.replace(
  'className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600"',
  'className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-[var(--color-eds-border)] rounded-md text-[10px] font-bold text-[var(--color-eds-text-secondary)] shadow-sm"'
);

// Bell Button
code = code.replace(
  '<button className="relative p-2.5 rounded-md text-slate-700 hover:bg-slate-100 border-l-4 border-transparent font-medium rounded-none rounded-r-lg hover:text-slate-600 transition-colors">',
  '<button className="relative p-2.5 rounded-full text-[var(--color-eds-text-secondary)] hover:bg-[var(--color-eds-bg)] hover:text-[var(--color-eds-text-primary)] transition-colors">'
);

// Avatar
code = code.replace(
  '<div className="h-10 w-10 rounded-md bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:shadow-md transition-all">',
  '<div className="h-10 w-10 rounded-full bg-[var(--color-eds-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:shadow-md transition-all ring-2 ring-white">'
);

// Breadcrumbs formatting
code = code.replace(
  'className="flex items-center text-xs font-bold text-slate-600 uppercase tracking-wider mb-2"',
  'className="flex items-center text-[13px] font-medium text-[var(--color-eds-text-secondary)] tracking-wide mb-1"'
);

code = code.replace(
  /text-blue-600/g,
  'text-[var(--color-eds-text-primary)] font-bold'
);

code = code.replace(
  /text-blue-800/g,
  'text-[var(--color-eds-primary)] font-bold'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Header EDS applied');
