const fs = require('fs');
const file = 'src/Tampuyak.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `<input type="text" placeholder="Cari..." className="pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-sm w-40 focus:ring-2 focus:ring-indigo-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />`;
const replacement = `<input type="text" placeholder="Cari..." className="pl-9 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-sm w-40 focus:ring-2 focus:ring-indigo-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); window.find(searchQuery); } }} />`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
console.log("Updated search box string replace");
