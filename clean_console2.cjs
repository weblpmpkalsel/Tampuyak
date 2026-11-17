const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Revert the previous // console.log(
  content = content.replace(/\/\/ console\.log\(/g, 'console.log(');
  
  // Replace console.log with a no-op that doesn't break syntax
  // e.g., (void 0)/* console.log */(
  // But console.log(...) can be multi-line.
  // Actually, replacing `console.log` with `/* console.log */ (() => {})` is a safe function replacement.
  content = content.replace(/console\.log/g, '(/* console.log removed */ () => {})');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
});
