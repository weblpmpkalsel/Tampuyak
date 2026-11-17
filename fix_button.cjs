const fs = require("fs");
let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

content = content.replace(
  /const baseStyle =[\s\S]*?"inline-flex items-center justify-center px-5 py-3 text-sm font-bold rounded-2xl transition-all duration-300 active:scale-\[0\.98\] outline-none";/g,
  `const baseStyle = "inline-flex items-center justify-center px-4 py-2.5 text-[15px] font-semibold rounded transition-colors duration-200 outline-none";`
);

content = content.replace(
  /primary:[\s\S]*?"bg-indigo-600 text-white shadow-\[0_4px_14px_0_rgb\(79,70,229,0\.39\)\] hover:shadow-\[0_6px_20px_rgba\(79,70,229,0\.23\)\] hover:bg-indigo-700 hover:-translate-y-0\.5",/g,
  `primary: "bg-indigo-700 text-white hover:bg-indigo-800 shadow-sm border border-transparent",`
);

content = content.replace(
  /secondary:[\s\S]*?"bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0\.5",/g,
  `secondary: "bg-white text-slate-800 border border-slate-300 shadow-sm hover:bg-slate-50",`
);

content = content.replace(
  /danger:[\s\S]*?"bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold border border-red-100",/g,
  `danger: "bg-white text-red-700 border border-red-300 shadow-sm hover:bg-red-50 hover:border-red-400",`
);

content = content.replace(
  /outline:[\s\S]*?"border-2 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50\/30",/g,
  `outline: "bg-transparent border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50",`
);

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Button updated");
