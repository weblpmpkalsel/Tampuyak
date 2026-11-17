import fs from 'fs';

let lines = fs.readFileSync('src/Tampuyak.tsx', 'utf8').split('\n');

const sidebarIndex = lines.findIndex(l => l.includes('{/* Navigation Sidebar */}'));
const sidebarLines = lines.splice(sidebarIndex, 28); // remove sidebar

// Find the end of the doc renderer block.
// Let's find "Footer Page Number Simulation"
const footerIndex = lines.findIndex(l => l.includes('{/* Footer Page Number Simulation */}'));
// It is followed by:
//                <div className="absolute bottom-[15mm] w-full text-center text-slate-400 text-[10pt] font-serif">
//                   <p>{activePageId === 'cover' ? '' : activePageId === 'pengesahan' ? 'i' : activePageId === 'daftar_isi' ? 'ii' : '1'}</p>
//                </div>
//             </div>
//          </div>
// We need to insert the sidebar here, before the `</div>` that closes the `grid` block.

lines.splice(footerIndex + 5, 0, ...sidebarLines);

fs.writeFileSync('src/Tampuyak.tsx', lines.join('\n'));
console.log('Fixed');
