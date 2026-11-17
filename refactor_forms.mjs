import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace form styling
content = content.replace(/border-slate-300/g, 'border-[var(--color-eds-border)]');
content = content.replace(/focus:border-blue-600/g, 'focus:border-[var(--color-eds-primary)]');
content = content.replace(/focus:ring-blue-600/g, 'focus:ring-[var(--color-eds-primary)]');
content = content.replace(/hover:border-blue-400/g, 'hover:border-[var(--color-eds-primary)]');

content = content.replace(/border-red-500/g, 'border-[var(--color-eds-danger)]');
content = content.replace(/bg-red-50/g, 'bg-[#FCE8E6]');
content = content.replace(/focus:border-red-600/g, 'focus:border-[var(--color-eds-danger)]');
content = content.replace(/focus:ring-red-600/g, 'focus:ring-[var(--color-eds-danger)]');

content = content.replace(/text-red-500/g, 'text-[var(--color-eds-danger)]');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Form terms replaced');
