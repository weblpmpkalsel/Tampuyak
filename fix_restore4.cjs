const fs = require('fs');
let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const lineStart = lines.findIndex(l => l.includes('(settings.relationalPlanning?.objectives || []).map((obj: any, i: number) => {'));
if (lineStart > -1) {
  // we want to fix around 10-15 lines down
  console.log("Found at", lineStart);
} else {
  // it might be (obj, i)
  const alt = lines.findIndex(l => l.includes('(settings.relationalPlanning?.objectives || []).map((obj'));
  console.log("Alt found at", alt);
  
  if (alt > -1) {
    console.log(lines.slice(alt, alt + 15).join('\n'));
    // we see that at alt + 7 or so, it is `))} ` and then `} } } } </div>`
    const badEnd = lines.findIndex((l, idx) => idx > alt && l.trim() === '))}');
    if (badEnd > -1) {
       console.log("Found end at", badEnd);
       // we remove 4 lines after badEnd
       lines.splice(badEnd + 1, 4);
       fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
       console.log("Fixed the exact 4 lines!");
    }
  }
}
