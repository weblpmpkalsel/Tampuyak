const fs = require("fs");
let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

// Input
content = content.replace(
  /className=\{\`w-full \$\{prefix \? "pl-12" : "px-4"\} py-3\.5 bg-slate-50\/50 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:bg-white transition-all duration-300 \$\{isMissing \? "border-amber-200 bg-amber-50\/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-500\/10" : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500\/10"\} \$\{disabled \? "opacity-60 cursor-not-allowed bg-slate-100\/50 border-transparent" : "hover:border-slate-200"\}\`\}/g,
  `className={\`w-full \${prefix ? "pl-10" : "px-3"} py-2.5 bg-white border rounded text-[15px] font-medium focus:outline-none transition-colors duration-200 \${isMissing ? "border-red-400 bg-red-50 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-400 focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 hover:border-slate-500"} \${disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}\`}`
);

// Textarea
content = content.replace(
  /className=\{\`w-full px-4 py-3\.5 bg-slate-50\/50 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:bg-white transition-all duration-300 resize-y \$\{isMissing \? "border-amber-200 bg-amber-50\/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-500\/10" : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500\/10 hover:border-slate-200"\}\`\}/g,
  `className={\`w-full px-3 py-2.5 bg-white border rounded text-[15px] font-medium focus:outline-none transition-colors duration-200 resize-y \${isMissing ? "border-red-400 bg-red-50 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-400 focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 hover:border-slate-500"}\`}`
);

// Select
content = content.replace(
  /className=\{\`w-full px-4 py-3\.5 bg-slate-50\/50 border-2 rounded-2xl text-sm font-medium focus:outline-none focus:bg-white transition-all duration-300 appearance-none cursor-pointer \$\{isMissing \? "border-amber-200 bg-amber-50\/30 focus:border-amber-400 focus:ring-4 focus:ring-amber-500\/10" : "border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500\/10 hover:border-slate-200"\}\`\}/g,
  `className={\`w-full px-3 py-2.5 bg-white border rounded text-[15px] font-medium focus:outline-none transition-colors duration-200 appearance-none cursor-pointer \${isMissing ? "border-red-400 bg-red-50 focus:border-red-600 focus:ring-1 focus:ring-red-600" : "border-slate-400 focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 hover:border-slate-500"}\`}`
);

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Forms updated");
