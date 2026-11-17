import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace standard colors for descriptions
content = content.replace(/text-\[var\(--color-eds-text-secondary\)\]/g, "text-[var(--color-eds-text-secondary)]"); // Just testing match
content = content.replace(/text-slate-[45]00/g, "text-[var(--color-eds-text-secondary)]");

// We need to convert some text-secondary to text-primary where they are explanatory text/paragraphs/descriptions.
// E.g. <p className="text-secondary ...
content = content.replace(/<p className="([^"]*)text-\[var\(--color-eds-text-secondary\)\]([^"]*)">/g, '<p className="$1text-[var(--color-eds-text-primary)] font-medium$2">');
// Note: We might also want to change `<div className="... text-secondary ...">` if they are descriptions.

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed some contrast rules');
