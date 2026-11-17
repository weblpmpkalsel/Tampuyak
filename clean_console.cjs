const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Remove console.log(...) 
  // Be careful not to remove multi-line console.logs that might break syntax if removed blindly.
  // We can use a regex, but simpler might be just commenting it out or replacing it.
  // Actually, replacing `console.log` with `// console.log` might be safest.
  content = content.replace(/console\.log\(/g, '// console.log(');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});
