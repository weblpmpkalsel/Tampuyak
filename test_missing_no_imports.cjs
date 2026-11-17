const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Find all properties in DEFAULT_SETTINGS
let match = file.match(/const DEFAULT_SETTINGS = (\{[\s\S]*?\n  \});\n/);
let settingsStr = match ? match[1] : '';

// Just do a simple regex check for the keys we're interested in
const sections = [
  "pesertaDidik", 
  "guru", 
  "tendik", 
  "sarpras", 
  "academicCalendar", 
  "komite", 
  "potensi", 
  "prestasi", 
  "programUnggulan"
];

sections.forEach(sec => {
  if (settingsStr.includes(sec + ":") || settingsStr.includes(sec + " :")) {
    console.log(sec, "PRESENT");
  } else {
    console.log(sec, "MISSING");
  }
});

