const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Modify LayoutContainer to store active article ID
code = code.replace(
  'const [currentView, setCurrentView] = useState("beranda");',
  'const [currentView, setCurrentView] = useState("beranda");\n  const [activeArticleId, setActiveArticleId] = useState<string | undefined>(undefined);'
);

code = code.replace(
  /const handleOpenKnowledge = \(e: any\) => \{\n\s*if \(e\.detail\) \{\n\s*setCurrentView\("pusatPengetahuan"\);\n\s*\}\n\s*\};/,
  `const handleOpenKnowledge = (e: any) => {
      if (e.detail) {
        setActiveArticleId(e.detail);
        setCurrentView("pusatPengetahuan");
      } else {
        setActiveArticleId(undefined);
      }
    };`
);

code = code.replace(
  '{currentView === "pusatPengetahuan" && <PusatPengetahuanView />}',
  '{currentView === "pusatPengetahuan" && <PusatPengetahuanView initialArticleId={activeArticleId} />}'
);

// We should also clear activeArticleId when leaving PusatPengetahuan?
// Actually, it's fine, if they navigate normally we can pass undefined. Or just pass initialArticleId.

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("LayoutContainer state modified.");
