const fs = require('fs');
let file = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

file = file.replace(
`            {currentView === "beranda" && (`,
`            {currentView === "uat" && <UATView navigateToView={setCurrentView} navigateToSettings={handleNavigateToSettings} />}
            {currentView === "beranda" && (`
);

fs.writeFileSync('src/Tampuyak.tsx', file);
