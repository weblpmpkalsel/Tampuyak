const inputs = [
  "70",
  "70,5",
  "70.5",
  "100",
  "100,00",
  "0",
  "0,0",
  "",
  null,
  undefined,
  "1.234,56"
];

console.log("==================================================");
console.log("OUTPUT");
console.log("==================================================\n");

for (const val of inputs) {
  const isTruthy = !!val;
  const normalized = isTruthy ? String(val).replace(',', '.') : 'N/A';
  const finalNum = isTruthy ? parseFloat(String(val).replace(',', '.')) : 0;
  
  const displayVal = val === "" ? '""' : (val === null ? "null" : (val === undefined ? "undefined" : `"${val}"`));
  
  console.log(`Input: ${displayVal}`);
  console.log(`↓`);
  console.log(`Normalized: ${normalized}`);
  console.log(`↓`);
  console.log(`Final Number: ${finalNum}`);
  console.log("--------------------------------------------------");
}
