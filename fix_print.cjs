const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// Fix Ctrl+P
code = code.replace(
    `if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
      }`,
    `if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setPrintMode({ id: docId, isPrintReady });
      }`
);

// Fix Print Draft button
code = code.replace(
    `<Button variant="outline" className="h-9 px-3 gap-2 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => window.print()} disabled={!isDraftReady} title="Cetak Draft">`,
    `<Button variant="outline" className="h-9 px-3 gap-2 text-[var(--color-eds-text-secondary)] hover:bg-slate-100 ml-2" onClick={() => setPrintMode({ id: docId, isPrintReady: false })} disabled={!isDraftReady} title="Cetak Draft">`
);

// Fix Certified Print button
code = code.replace(
    `<Button variant="default" className="h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-2" onClick={() => window.print()} disabled={!isPrintReady} title="Cetak Versi Tersertifikasi">`,
    `<Button variant="default" className="h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-2" onClick={() => setPrintMode({ id: docId, isPrintReady: true })} disabled={!isPrintReady} title="Cetak Versi Tersertifikasi">`
);

// Fix bottom Print button
code = code.replace(
    `onClick={() => window.print()}
                       className={\`font-bold \${isDraftReady ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-[var(--color-eds-text-secondary)] cursor-not-allowed'}\`}`,
    `onClick={() => setPrintMode({ id: docId, isPrintReady })}
                       className={\`font-bold \${isDraftReady ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-200 text-[var(--color-eds-text-secondary)] cursor-not-allowed'}\`}`
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Done');
