const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldButton = `<Button 
                       disabled={!isPrintReady} 
                       onClick={handlePrintClick}
                       className={\`font-bold \${isPrintReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}\`}
                     >
                        <Printer className="w-4 h-4 mr-2" /> Sertifikasi Cetak
                     </Button>`;

const newButton = `<Button 
                       disabled={!isDraftReady} 
                       onClick={handlePrintClick}
                       className={\`font-bold \${isDraftReady ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}\`}
                     >
                        <Printer className="w-4 h-4 mr-2" /> {isPrintReady ? "Cetak Final" : "Cetak Draft"}
                     </Button>`;

code = code.replace(oldButton, newButton);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Replaced button logic');
