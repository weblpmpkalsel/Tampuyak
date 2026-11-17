import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Form labels
content = content.replace(/text-slate-500/g, "text-[var(--color-eds-text-primary)]");
content = content.replace(/text-slate-400/g, "text-[var(--color-eds-text-secondary)]");

// For <p> tags with secondary text, convert them to primary if they are descriptions
// We'll run a function to process all <p> and <label> tags
content = content.replace(/<(p|label)\s+className="([^"]+)"(.*?)>/g, (match, tag, classes, rest) => {
    // If it contains text-xs or uppercase, it's metadata/caption -> keep secondary or change to secondary if not
    let hasCaptionContext = classes.includes('text-xs') || classes.includes('uppercase') || classes.includes('tracking-widest');
    
    if (classes.includes('text-[var(--color-eds-text-secondary)]') && !hasCaptionContext) {
        // Replace with primary
        classes = classes.replace('text-[var(--color-eds-text-secondary)]', 'text-[var(--color-eds-text-primary)]');
        // Ensure font-medium for readability
        if (!classes.includes('font-medium') && !classes.includes('font-bold') && !classes.includes('font-black')) {
            classes += ' font-medium';
        }
    }
    return `<${tag} className="${classes}"${rest}>`;
});

// Remove opacity from text
content = content.replace(/text-sm opacity-80 mt-1/g, 'text-sm font-medium mt-1');
content = content.replace(/whitespace-pre-wrap leading-relaxed opacity-60/g, 'whitespace-pre-wrap leading-relaxed text-[var(--color-eds-text-secondary)]');
content = content.replace(/opacity-60 cursor-not-allowed bg-slate-50/g, 'text-[var(--color-eds-disabled)] cursor-not-allowed bg-slate-50 border-[var(--color-eds-disabled)]');

// Replace any remaining text-gray or text-slate used for text with primary or secondary based on context
content = content.replace(/text-gray-500/g, 'text-[var(--color-eds-text-primary)]');
content = content.replace(/text-gray-400/g, 'text-[var(--color-eds-text-secondary)]');

// For <div>s that might have text-secondary but are actually descriptions
// For example: EmptyState description (wait, EmptyState description is a <p> tag, we already handled it)
// Let's also check for text-secondary in tables. 
content = content.replace(/<td className="([^"]*)text-\[var\(--color-eds-text-secondary\)\]([^"]*)">/g, '<td className="$1text-[var(--color-eds-text-primary)] font-medium$2">');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed contrast for descriptions and labels');
