import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace all those monstrous ternary classes for the sidebar with template strings using the enterprise classes.

content = content.replace(/className={`w-full flex items-center px-3 py-2.5 rounded-xl text-\[14px\] font-bold transition-all duration-300 \${currentView === "(.*?)" \? "bg-blue-50 border-l-4 border-blue-700 text-\[var\(--color-eds-primary\)\] font-bold rounded-none rounded-r-lg shadow-sm font-semibold" : "text-\[var\(--color-eds-text-primary\)\] hover:bg-slate-100 border-l-4 border-transparent font-medium rounded-none rounded-r-lg"}`}/g, 
  'className={`enterprise-sidebar-item ${currentView === "$1" ? "active" : ""}`}');

content = content.replace(/className={`w-full flex items-center px-3 py-2.5 rounded-xl text-\[14px\] font-bold transition-all duration-300 \${\[(.*?)\]\.includes\(currentView\) \? "bg-blue-50 border-l-4 border-blue-700 text-\[var\(--color-eds-primary\)\] font-bold rounded-none rounded-r-lg shadow-sm font-semibold" : "text-\[var\(--color-eds-text-primary\)\] hover:bg-slate-100 border-l-4 border-transparent font-medium rounded-none rounded-r-lg"}`}/g, 
  'className={`enterprise-sidebar-item ${[$1].includes(currentView) ? "active" : ""}`}');

content = content.replace(/className={`w-5 h-5 mr-4 \${currentView === "(.*?)" \? "text-blue-700" : "text-\[var\(--color-eds-text-secondary\)\]"}`}/g, 
  'className="enterprise-sidebar-icon"');

content = content.replace(/className={`w-5 h-5 mr-4 \${\[(.*?)\]\.includes\(currentView\) \? "text-blue-700" : "text-\[var\(--color-eds-text-secondary\)\]"}`}/g, 
  'className="enterprise-sidebar-icon"');


// Fix the DQA engine one which is slightly different
content = content.replace(/className={`w-full flex items-center px-3 py-2.5 mx-2 my-0.5 text-\[14px\] transition-all duration-200 rounded-xl \${currentView === "dqaEngine" \? "bg-\[var\(--color-eds-success\)\] text-white font-bold shadow-md shadow-green-600\/20" : "text-\[var\(--color-eds-success\)\] hover:bg-green-50 font-medium"}`} style={{ width: "calc\(100% - 16px\)" }}/g,
  'className={`enterprise-sidebar-item ${currentView === "dqaEngine" ? "active !border-green-600 !bg-green-50 !text-green-800" : ""}`}');
  
content = content.replace(/className={`w-5 h-5 mr-4 \${currentView === "dqaEngine" \? "text-white" : "text-emerald-700"}`}/g,
  'className="enterprise-sidebar-icon"');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Sidebar refactoring complete');
