import fs from 'fs';

let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// I will just use string replacement on the Pratinjau layout
// It's currently:
// {activeTab === "pratinjau" && (
//   <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
//     {/* Navigation Sidebar */}

const part1 = code.split('{/* Navigation Sidebar */}');
const part2 = part1[1].split('{/* Document Renderer Area */}');

// The layout should be:
// <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
//   {/* Document Renderer Area */}
//   ...
//   {/* Navigation Sidebar */}
//   ...
// </div>

const newCode = part1[0] + 
  '{/* Document Renderer Area */}' + 
  part2[1] + 
  '{/* Navigation Sidebar */}' + 
  part2[0];

fs.writeFileSync('src/Tampuyak.tsx', newCode);
