import fs from 'fs';

let content = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

// Replace standard Badge usages
content = content.replace(/<span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded font-bold">READY<\/span>/g, '<Badge variant="completed">READY</Badge>');
content = content.replace(/<span className="px-3 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">PASS<\/span>/g, '<Badge variant="completed">PASS</Badge>');
content = content.replace(/<span className="px-3 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700">FAIL<\/span>/g, '<Badge variant="blocked">FAIL</Badge>');
content = content.replace(/<span className="px-3 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700">WARN<\/span>/g, '<Badge variant="pending">WARN</Badge>');

fs.writeFileSync('src/Tampuyak.tsx', content);
console.log('Badge refactoring complete');
