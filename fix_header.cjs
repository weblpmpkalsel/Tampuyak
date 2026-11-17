const fs = require("fs");
let content = fs.readFileSync("src/Tampuyak.tsx", "utf8");

content = content.replace(
  /bg-white\/70 backdrop-blur-xl border-b border-slate-200\/60/g,
  "bg-white border-b border-slate-200"
);

content = content.replace(
  /bg-white\/80 backdrop-blur-xl rounded-\[24px\] border border-slate-200\/60/g,
  "bg-white rounded-lg border border-slate-200"
);

// Modals backdrop can keep backdrop-blur, it's standard. But let's check text colors in hero areas that are now white.
// Because I changed the banner to bg-white, all text inside must be dark.
// But some titles might still be "text-white". Let's check for "text-white" in headers.
content = content.replace(
  /<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">/g,
  `<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">`
);

content = content.replace(
  /<h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-white">/g,
  `<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">`
);

content = content.replace(
  /<h2 className="text-2xl font-black tracking-tight text-white mb-2">/g,
  `<h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">`
);

// Any other <h1/2/3> with text-white
content = content.replace(/className="([^"]*)text-white([^"]*)"/g, (match, p1, p2) => {
  // If it's a button or badge, keep text-white. If it's a heading, change to text-slate-900.
  // Actually, too risky with regex. I will just rely on the fact that I replaced the entire class for banners.
  return match;
});

fs.writeFileSync("src/Tampuyak.tsx", content);
console.log("Header fixed");
