const fs = require('fs');
let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// 1. Add "Pusat Pengetahuan" button in sidebar
const sidebarMarker = 'Pengaturan\n          </button>';
const sidebarButton = `
          <button
            onClick={() => setCurrentView("pusatPengetahuan")}
            className={\`w-full flex items-center px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-300 \${currentView === "pusatPengetahuan" ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"}\`}
          >
            <BookOpen
              className={\`w-5 h-5 mr-3.5 \${currentView === "pusatPengetahuan" ? "text-slate-300" : "text-slate-400"}\`}
            />
            Pusat Pengetahuan
          </button>`;

if (content.includes(sidebarMarker) && !content.includes('Pusat Pengetahuan\n          </button>')) {
  content = content.replace(sidebarMarker, sidebarMarker + sidebarButton);
}

// 2. Import BookOpen
const iconImport = "import {\n  ActivitySquare,\n";
const bookOpenImport = "import {\n  BookOpen,\n  ActivitySquare,\n";
if (content.includes(iconImport) && !content.includes('BookOpen')) {
  content = content.replace(iconImport, bookOpenImport);
} else if (content.includes('import {') && !content.includes('BookOpen')) {
    const lucideImportMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/);
    if (lucideImportMatch) {
        const replacement = lucideImportMatch[0].replace(/import\s+\{/, 'import { BookOpen, ');
        content = content.replace(lucideImportMatch[0], replacement);
    }
}


fs.writeFileSync('src/Tampuyak.tsx', content);
