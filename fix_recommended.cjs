const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex7 = /\{\!settings\.identityAssets\?\.stamp\?\.url && <li className="flex items-start"><XCircle className="w-4 h-4 mr-2 text-rose-500 shrink-0 mt-0\.5"\/> Stempel basah belum diunggah<\/li>\}/;
const replacement7 = `{!isPrintReady && recommendedChecks.some(c => !c.valid) && (
                              <li className="flex items-start text-amber-700">
                                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500 shrink-0 mt-0.5"/> 
                                Recommended. The document may still be printed using manual signatures and wet stamps.
                              </li>
                           )}`;

code = code.replace(regex7, replacement7);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Updated recommended checks text');
