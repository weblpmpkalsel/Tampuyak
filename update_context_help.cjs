const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Modifying ContextHelpButton
const newContextHelpButton = `const ContextHelpButton = ({ articleId }: { articleId: string }) => {
  return (
    <div className="relative inline-block ml-3">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const event = new CustomEvent('openKnowledge', { detail: articleId });
          window.dispatchEvent(event);
        }}
        className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Bantuan Konteks"
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
};`;

code = code.replace(/const ContextHelpButton = \(\{ title, purpose, importance, nextSteps \}: any\) => \{[\s\S]*?<\/div>\n  \);\n\};/, newContextHelpButton);

// Update calls to ContextHelpButton
code = code.replace(
  /<ContextHelpButton\n\s*title="RKT \(Rencana Kerja Tahunan\)"[\s\S]*?\/>/,
  '<ContextHelpButton articleId="panduan-rkt" />'
);

code = code.replace(
  /<ContextHelpButton\n\s*title="RKAS \(Rencana Kegiatan dan Anggaran Sekolah\)"[\s\S]*?\/>/,
  '<ContextHelpButton articleId="panduan-rkas" />'
);

code = code.replace(
  /<ContextHelpButton\n\s*title="Pelaksanaan & Monitoring"[\s\S]*?\/>/,
  '<ContextHelpButton articleId="panduan-monitoring" />'
);

code = code.replace(
  /<ContextHelpButton\n\s*title="Analisis Sekolah"[\s\S]*?\/>/,
  '<ContextHelpButton articleId="panduan-analisis" />'
);

// Add event listener in LayoutContainer
const layoutListener = `
  useEffect(() => {
    const handleOpenKnowledge = (e: any) => {
      if (e.detail) {
        setCurrentView("pusatPengetahuan");
      }
    };
    window.addEventListener('openKnowledge', handleOpenKnowledge);
    return () => window.removeEventListener('openKnowledge', handleOpenKnowledge);
  }, []);
`;

code = code.replace(
  /const \[hasCompletedOnboarding, setHasCompletedOnboarding\] = useState\(\(\) => \{\n\s*return localStorage\.getItem\("tampuyak\.onboarded"\) === "true";\n\s*\}\);/,
  'const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {\n    return localStorage.getItem("tampuyak.onboarded") === "true";\n  });\n' + layoutListener
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("ContextHelpButton modified successfully.");
