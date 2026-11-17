const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/ksp/KSPDashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('onOpenSettings: () => void')) {
  content = content.replace(
    "export const KSPDashboard = ({ onOpenPreview, onOpenValidation, onOpenAttachments }: { onOpenPreview: () => void, onOpenValidation: () => void, onOpenAttachments: () => void }) => {",
    "export const KSPDashboard = ({ onOpenPreview, onOpenValidation, onOpenAttachments, onOpenSettings }: { onOpenPreview: () => void, onOpenValidation: () => void, onOpenAttachments: () => void, onOpenSettings: () => void }) => {"
  );
  
  content = content.replace(
    /<button className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm group">\s*<Settings className="w-8 h-8 text-gray-500 mb-3 group-hover:scale-110 transition-transform duration-200" \/>\s*<span className="font-bold text-gray-900 group-hover:text-gray-700">KSP Settings<\/span>\s*<\/button>/,
    `<button onClick={onOpenSettings} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm group">
              <Settings className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-gray-900 group-hover:text-indigo-700">KSP Settings</span>
            </button>`
  );
  
  fs.writeFileSync(file, content);
  console.log("Patched KSPDashboard.tsx");
}
