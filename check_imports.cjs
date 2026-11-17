const fs = require('fs');
const content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

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

const undefinedComponents = [];
for (const comp of componentNames) {
  if (!content.includes(comp)) continue; 
  
  const isImported = new RegExp('import\\\\s+\\\\{[^}]*\\\\b' + comp + '\\\\b[^}]*\\\\}\\\\s+from').test(content);
  const isDefaultImported = new RegExp('import\\\\s+' + comp + '\\\\s+from').test(content);
  const isConst = new RegExp('const\\\\s+' + comp + '\\\\b').test(content);
  const isLet = new RegExp('let\\\\s+' + comp + '\\\\b').test(content);
  const isFunc = new RegExp('function\\\\s+' + comp + '\\\\b').test(content);
  
  if (!isImported && !isDefaultImported && !isConst && !isLet && !isFunc) {
     undefinedComponents.push(comp);
  }
}

console.log("Undefined components/icons:", undefinedComponents);
