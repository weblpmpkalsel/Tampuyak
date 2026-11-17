import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Remove Production Readiness button from sidebar
content = content.replace(/<button\s+onClick=\{\(\) => setCurrentView\("productionReadiness"\)\}[\s\S]*?Kesiapan Sistem\s*<\/button>/, '');

// If there's a view renderer for productionReadiness, remove it too
content = content.replace(/\{currentView === "productionReadiness" && <ProductionReadinessView \/>\}/, '');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Removed Production Readiness');
