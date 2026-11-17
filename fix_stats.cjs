const fs = require("fs");
let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

content = content.replace(
  /className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 border-none"/g,
  `className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-6"`
);
content = content.replace(
  /className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 border-none"/g,
  `className="bg-rose-50 border border-rose-200 text-rose-900 p-6"`
);
content = content.replace(
  /className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 border-none"/g,
  `className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6"`
);

// We need to fix the inner text classes for these cards. They might be text-white/80, text-indigo-100, text-3xl font-black, etc.
// But doing it safely. Let's check lines 10759 to 10780.
// Let's run this simple replace for now.

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Stats cards fixed");
