const fs = require('fs');

const files = [
  'src/RKASDocument/Chapter2Builder.ts',
  'src/RKTDocument/BudgetBuilder.ts',
  'src/RKTDocument/ActivityBuilder.ts',
  'src/RKTDocument/MonitoringBuilder.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/,\s*orientation:\s*"landscape"/g, '');
  content = content.replace(/orientation:\s*"landscape",?\s*/g, '');
  fs.writeFileSync(file, content);
}
