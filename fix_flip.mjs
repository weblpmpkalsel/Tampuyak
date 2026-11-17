import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// I need to find the sidebar block and put it back.
// Currently the end of the file looks like:
// }
// {/* Navigation Sidebar */}
// <div className="xl:col-span-3 ...
// </div>
//           
// I'll extract it and put it back where it was.

let lines = code.split('\n');
const sidebarIndex = lines.findIndex(l => l.includes('{/* Navigation Sidebar */}'));
if (sidebarIndex > -1) {
  const sidebarLines = lines.splice(sidebarIndex, 28); // 28 lines for the sidebar
  // Find where it should go, which is right after `{activeTab === "pratinjau" && (`
  // which is followed by `<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">`
  // Actually, I can just find `{/* Document Renderer Area */}`
  const docRendererIndex = lines.findIndex(l => l.includes('{/* Document Renderer Area */}'));
  // Insert the sidebar lines BEFORE the doc renderer area, or AFTER the doc renderer area ends.
  // The goal is to have the doc renderer FIRST (span-9) and sidebar SECOND (span-3).
  // Let's find where the doc renderer `div` ends.
  
  // It's easier to put the sidebar lines right after the doc renderer area block.
  // We can locate the `)}` that closes `activeTab === "pratinjau"`.
  let reviewIndex = lines.findIndex(l => l.includes('{activeTab === "review" && ('));
  // Insert sidebar right before reviewIndex
  lines.splice(reviewIndex - 1, 0, ...sidebarLines);
  
  fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
  console.log("Fixed!");
} else {
  console.log("Sidebar not found at end");
}
