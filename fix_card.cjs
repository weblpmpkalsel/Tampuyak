const fs = require("fs");
let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

content = content.replace(
  /bg-white\/80 backdrop-blur-xl rounded-\[24px\] shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] border border-slate-100 hover:shadow-\[0_8px_30px_rgb\(0,0,0,0\.08\)\] hover:-translate-y-0\.5 transition-all duration-300 ease-in-out/g,
  "bg-white rounded-lg border border-slate-200 shadow-sm"
);

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Card updated");
