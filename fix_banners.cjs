const fs = require("fs");
let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

// Container replacement
content = content.replace(
  /className="bg-gradient-to-br [^"]+ rounded-2xl p-6 md:p-\d+ shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row (items-center|justify-between) [^"]+"/g,
  `className="bg-white border-t-[6px] border-indigo-700 rounded-lg shadow-sm flex flex-col md:flex-row $1 justify-between gap-8 p-6 md:p-8 border-x border-b border-slate-200"`
);

// Specifically for rounded-[24px] one on 4310
content = content.replace(
  /className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-\[24px\] p-6 text-white flex items-center justify-between shadow-xl"/g,
  `className="bg-white border-l-[6px] border-indigo-700 rounded-lg shadow-sm flex items-center justify-between p-6 border-y border-r border-slate-200"`
);

content = content.replace(
  /className="md:col-span-2 p-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-\[24px\] shadow-lg shadow-indigo-500\/20 text-white relative overflow-hidden group hover:scale-\[1\.01\] transition-transform"/g,
  `className="md:col-span-2 p-6 bg-white border border-slate-200 rounded-lg shadow-sm relative overflow-hidden group"`
);

// Inner decorative elements
content = content.replace(
  /<div className="absolute top-0 right-0 w-\[500px\] h-\[500px\] [^>]+><\/div>/g,
  ""
);

// Header badges (Ringkasan Eksekutif, etc.)
content = content.replace(
  /className="inline-flex items-center px-4 py-1\.5 bg-white\/10 backdrop-blur-md border border-white\/10 rounded-full text-xs font-bold tracking-widest uppercase mb-[46] text-(indigo|emerald|slate|blue)-200"/g,
  `className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 rounded text-xs font-bold tracking-wide uppercase mb-4 text-indigo-800"`
);

// H1 headers inside banners
content = content.replace(
  /<h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">/g,
  `<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">`
);

// P subtitles
content = content.replace(
  /<p className="text-(indigo|slate)-100\/80 text-xl font-medium mb-8">/g,
  `<p className="text-slate-600 text-lg font-medium mb-6">`
);

// Fix bg-white/10 card inside the banners
content = content.replace(
  /className="bg-white\/10 backdrop-blur-md border border-white\/20 rounded-\[24px\] p-6 w-full text-center"/g,
  `className="bg-slate-50 border border-slate-200 rounded-lg p-6 w-full text-center"`
);
content = content.replace(
  /className="bg-white\/10 backdrop-blur-xl border border-white\/20 p-6 rounded-2xl"/g,
  `className="bg-slate-50 border border-slate-200 rounded-lg p-6"`
);

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Banners updated");
