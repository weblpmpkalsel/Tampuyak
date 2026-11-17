import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/text-blue-200/g, 'text-[var(--color-eds-text-secondary)]');
content = content.replace(/text-blue-100/g, 'text-[var(--color-eds-text-secondary)]');
content = content.replace(/text-blue-300/g, 'text-[var(--color-eds-text-secondary)]');
content = content.replace(/text-emerald-200/g, 'text-[var(--color-eds-text-secondary)]');
content = content.replace(/text-emerald-100\/90/g, 'text-[var(--color-eds-text-secondary)]');
content = content.replace(/text-emerald-400/g, 'text-[var(--color-eds-text-secondary)]');
// text-white is valid on colored backgrounds. We'll leave it as is unless it's specifically those containers.

// Fix specific containers that were supposed to be dark but are bg-white
// 8865: bg-white border-t-4 border-blue-800 ... => We'll just let the text colors become secondary text and primary text.
// wait, we replaced text-blue-200 with text-secondary, so text-white in that container will still be invisible on bg-white!
// Let's replace that specific <strong className="text-white"> with text-[var(--color-eds-text-primary)]
content = content.replace(/<strong className="text-white">([^<]*)<\/strong>/g, '<strong className="text-[var(--color-eds-text-primary)] font-bold">$1</strong>');
content = content.replace(/<p className="text-xs font-bold text-white mt-3 uppercase tracking-wider">/g, '<p className="text-xs font-bold text-[var(--color-eds-text-secondary)] mt-3 uppercase tracking-wider">');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed light text colors safely');
