const fs = require("fs");
const lines = fs.readFileSync("src/Tampuyak.tsx", "utf8").split("\n");

for(let i=0; i<lines.length; i++) {
  if(lines[i].includes("text-white") || lines[i].includes("text-slate-100") || lines[i].includes("text-indigo-100")) {
    lines[i] = lines[i].replace(/text-white(?!(\/|\w))/g, "text-slate-900");
    lines[i] = lines[i].replace(/text-slate-100(?!(\/|\w))/g, "text-slate-700");
    lines[i] = lines[i].replace(/text-slate-200(?!(\/|\w))/g, "text-slate-700");
    lines[i] = lines[i].replace(/text-indigo-100(?!(\/|\w))/g, "text-slate-700");
    lines[i] = lines[i].replace(/text-indigo-200(?!(\/|\w))/g, "text-slate-600");
    lines[i] = lines[i].replace(/text-blue-100(?!(\/|\w))/g, "text-slate-700");
    lines[i] = lines[i].replace(/text-blue-200(?!(\/|\w))/g, "text-slate-600");
    
    // Some things like badges or specific buttons need to be kept text-white, but the `Button` primary uses `text-white` explicitly, and that is handled by the component.
    // Wait, replacing "text-white" to "text-slate-900" globally might break buttons that DO need to be white (e.g. `primary: "bg-indigo-700 text-white"`).
  }
}
