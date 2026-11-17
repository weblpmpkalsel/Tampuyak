const fs = require('fs');

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

// We know the broken lines are where we see `: any) => {` or similar on a line by itself or starting with it.
// Let's find those lines.

let toRemove = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith(': any) => {') || lines[i].trim().startsWith('}: any) => {')) {
    toRemove.push(i);
  }
}

console.log("Found broken lines at: ", toRemove);

// Let's look at the surrounding lines to see what to delete
toRemove.forEach(idx => {
  console.log("--- Surrounding lines for " + idx + " ---");
  for (let j = Math.max(0, idx - 5); j <= Math.min(lines.length - 1, idx + 5); j++) {
    console.log(j + ": " + lines[j]);
  }
});
