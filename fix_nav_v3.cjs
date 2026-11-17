const fs = require("fs");

let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

content = content.replace(/bg-slate-900 text-white shadow-md shadow-slate-900\/10/g, "bg-indigo-50 border-l-[4px] border-indigo-700 text-indigo-800 rounded-none rounded-r-lg shadow-sm font-semibold");
content = content.replace(/text-slate-500 hover:bg-slate-100/g, "text-slate-700 hover:bg-slate-100 border-l-[4px] border-transparent font-medium rounded-none rounded-r-lg");
content = content.replace(/\? "text-slate-400" : "text-slate-500"/g, "? \"text-indigo-700\" : \"text-slate-500\"");
content = content.replace(/bg-slate-900 text-white/g, "bg-indigo-700 text-white shadow-sm font-semibold"); // for any remaining ones, like frozen button
content = content.replace(/bg-slate-800 hover:bg-slate-900 text-white/g, "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm");

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Successfully replaced Sidebar Navigation styles");
