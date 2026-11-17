const fs = require('fs');

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Replace RKT derivation route
const rktRegex = /\{currentView === "rktDerivation" && \([\s\S]*?<RKTDerivationView[\s\S]*?\/\>[\s\S]*?\)\}/g;
code = code.replace(rktRegex, '{currentView === "rktDerivation" && <RelationalPlanningView initialTab="rkt" navigateToView={setCurrentView} />}');

// Replace RKAS derivation route
const rkasRegex = /\{currentView === "rkasDerivation" && \([\s\S]*?<RKASDerivationView[\s\S]*?\/\>[\s\S]*?\)\}/g;
code = code.replace(rkasRegex, '{currentView === "rkasDerivation" && <RelationalPlanningView initialTab="rkas" navigateToView={setCurrentView} />}');

// We also need to map "rkjmPipeline" to initialTab="rkjm" which is already done.
// But what about missing components being called in other places?
// Let's make sure the regex works.
if (!code.includes('<RelationalPlanningView initialTab="rkt"')) {
   // Fallback string replacement
   code = code.replace(
     /\{currentView === "rktDerivation" && \([\s\S]*?RKTDerivationView[\s\S]*?\)\}/,
     '{currentView === "rktDerivation" && <RelationalPlanningView initialTab="rkt" navigateToView={setCurrentView} />}'
   );
}
if (!code.includes('<RelationalPlanningView initialTab="rkas"')) {
   code = code.replace(
     /\{currentView === "rkasDerivation" && \([\s\S]*?RKASDerivationView[\s\S]*?\)\}/,
     '{currentView === "rkasDerivation" && <RelationalPlanningView initialTab="rkas" navigateToView={setCurrentView} />}'
   );
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Routes fixed');
