const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const navOld = `<button
            onClick={() => setCurrentView("governance")}
            className={\`w-full flex items-center px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-300 \${["governance"].includes(currentView) ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"}\`}
          >
            <ShieldCheck
              className={\`w-5 h-5 mr-3.5 \${["governance"].includes(currentView) ? "text-slate-300" : "text-slate-400"}\`}
            />
            Tata Kelola & Kepatuhan
          </button>`;

const navNew = `<button
            onClick={() => setCurrentView("governance")}
            className={\`w-full flex items-center px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-300 \${["governance"].includes(currentView) ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"}\`}
          >
            <ShieldCheck
              className={\`w-5 h-5 mr-3.5 \${["governance"].includes(currentView) ? "text-slate-300" : "text-slate-400"}\`}
            />
            Tata Kelola & Kepatuhan
          </button>

          <button
            onClick={() => setCurrentView("productionReadiness")}
            className={\`w-full flex items-center px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-300 \${["productionReadiness"].includes(currentView) ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"}\`}
          >
            <Rocket
              className={\`w-5 h-5 mr-3.5 \${["productionReadiness"].includes(currentView) ? "text-slate-300" : "text-slate-400"}\`}
            />
            Production Readiness
          </button>`;

if (content.includes(navOld)) {
  content = content.replace(navOld, navNew);
} else {
  console.log("Could not find navOld");
}

const mainOld = `{currentView === "governance" && <GovernanceComplianceView navigateToView={setCurrentView} navigateToSettings={setCurrentView} />}`;
const mainNew = `{currentView === "governance" && <GovernanceComplianceView navigateToView={setCurrentView} navigateToSettings={setCurrentView} />}
            {currentView === "productionReadiness" && <ProductionReadinessView />}`;

if (content.includes(mainOld)) {
  content = content.replace(mainOld, mainNew);
} else {
  console.log("Could not find mainOld");
}

const headerOld = `: currentView === "governance" ? "Tata Kelola & Kepatuhan"`;
const headerNew = `: currentView === "governance" ? "Tata Kelola & Kepatuhan"
                    : currentView === "productionReadiness" ? "Production Readiness"`;

if (content.includes(headerOld)) {
  content = content.replace(headerOld, headerNew);
} else {
  console.log("Could not find headerOld");
}

const importLucideOld = `import {
  ShieldCheck,
  Milestone,
  CheckSquare,`;
const importLucideNew = `import {
  ShieldCheck,
  Milestone,
  CheckSquare,
  Rocket,
  Gauge,
  Server,
  Layers,
  CheckCircle,
  FileBadge,
  Terminal,`;
if (content.includes(importLucideOld) && !content.includes('Rocket')) {
  content = content.replace(importLucideOld, importLucideNew);
} else {
  console.log("Could not find importLucideOld");
}

fs.writeFileSync('src/Tampuyak.tsx', content);
