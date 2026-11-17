const fs = require('fs');
const content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (line.includes('updateSetting(') || line.includes('setCurrentView(') || line.includes('navigateToView(')) {
    // Ignore if it's inside an event handler lambda
    if (line.includes('onClick') || line.includes('onChange') || line.includes('onFocus') || line.includes('onBlur') || line.includes('action:')) return;
    
    // Print the line
    console.log(`${i+1}: ${line}`);
  }
});
