const fs = require('fs');
const content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// 1. extract the lucide-react imports block
const lucideMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
if (!lucideMatch) {
  console.log("No lucide-react import found");
  process.exit(1);
}
const importedIcons = new Set(lucideMatch[1].split(',').map(s => s.trim()).filter(Boolean).map(s => {
  const parts = s.split(' as ');
  return parts.length > 1 ? parts[1].trim() : parts[0].trim();
}));

// 2. find all tags and icon props
const componentNames = new Set();
const rx = /<([A-Z][a-zA-Z0-9]*)/g;
let match;
while ((match = rx.exec(content)) !== null) {
  componentNames.add(match[1]);
}

const rx2 = /icon=\{\s*([A-Z][a-zA-Z0-9]*)\s*\}/g;
while ((match = rx2.exec(content)) !== null) {
  componentNames.add(match[1]);
}

const rx3 = /icon:\s*([A-Z][a-zA-Z0-9]*)/g;
while ((match = rx3.exec(content)) !== null) {
  componentNames.add(match[1]);
}

// 3. check against imported icons
const missing = [];
for (const comp of componentNames) {
  if (comp === "Fragment") continue; // special case if we used Fragment
  if (content.includes('const ' + comp + ' =') || content.includes('function ' + comp + '(')) {
     // defined in file
     continue;
  }
  // is it imported from lucide-react?
  if (!importedIcons.has(comp)) {
     missing.push(comp);
  }
}

console.log("Missing imports (potential):", missing);
