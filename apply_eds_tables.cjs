const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Thead
code = code.replace(
  /className="text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200"/g,
  'className="text-xs font-bold text-[var(--color-eds-text-secondary)] uppercase tracking-wider bg-[var(--color-eds-bg)] sticky top-0 border-b border-[var(--color-eds-border)]"'
);

// Tr Hover
code = code.replace(
  /hover:bg-slate-50\/50/g,
  'hover:bg-[var(--color-eds-bg)] transition-colors'
);

// Tbody divide
code = code.replace(
  /divide-y divide-slate-100/g,
  'divide-y divide-[var(--color-eds-border)]'
);

// Tbody divide
code = code.replace(
  /divide-y divide-slate-200/g,
  'divide-y divide-[var(--color-eds-border)]'
);

// generic text colors
code = code.replace(
  /text-slate-800/g,
  'text-[var(--color-eds-text-primary)]'
);
code = code.replace(
  /text-slate-700/g,
  'text-[var(--color-eds-text-primary)]'
);
code = code.replace(
  /text-slate-600/g,
  'text-[var(--color-eds-text-secondary)]'
);
code = code.replace(
  /text-slate-500/g,
  'text-[var(--color-eds-text-secondary)]'
);

// generic bg colors
code = code.replace(
  /bg-slate-50/g,
  'bg-[var(--color-eds-bg)]'
);

// Apply EDS card radius inside cards
code = code.replace(
  /rounded-md/g,
  'rounded-xl'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Tables and common EDS applied');
