import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

content = content.replace(/<(div|span)\s+className="([^"]+)"(.*?)>/g, (match, tag, classes, rest) => {
    let hasCaptionContext = classes.includes('text-xs') || classes.includes('uppercase') || classes.includes('tracking-widest') || classes.includes('text-[13px]');
    
    if (classes.includes('text-[var(--color-eds-text-secondary)]') && !hasCaptionContext) {
        // Change to primary
        classes = classes.replace('text-[var(--color-eds-text-secondary)]', 'text-[var(--color-eds-text-primary)]');
        if (!classes.includes('font-medium') && !classes.includes('font-bold') && !classes.includes('font-black')) {
            classes += ' font-medium';
        }
    }
    return `<${tag} className="${classes}"${rest}>`;
});

// Any 13px text should be converted to text-sm or text-xs
content = content.replace(/text-\[13px\]/g, 'text-xs');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Fixed contrast for divs and spans');
