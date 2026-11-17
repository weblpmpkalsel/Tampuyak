const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('standing by') || 
          content.toLowerCase().includes('build process') || 
          content.toLowerCase().includes('completed successfully')) {
        console.log('FOUND IN', fullPath);
      }
    }
  }
}
search('./src');
