const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/modules/ProfileModule.tsx', 'utf8');

code = code.replace(
  `    principalName: settings?.principal?.name || '', 
    status: settings?.school?.status || 'Negeri',`,
  `    principalName: settings?.principal?.name || '', 
    principalNip: settings?.principal?.nip || '',
    status: settings?.school?.status || 'Negeri',`
);

code = code.replace(
  `                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={identity.principalName}
                    onChange={(e) => updateIdentity('principalName', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    placeholder="mis. Budi Santoso, S.Pd"
                  />
                </div>`,
  `                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={identity.principalName || ''}
                      onChange={(e) => updateIdentity('principalName', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      placeholder="mis. Budi Santoso, S.Pd"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={identity.principalNip || ''}
                      onChange={(e) => updateIdentity('principalNip', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                      placeholder="NIP Kepala Sekolah"
                    />
                  </div>
                </div>`
);

fs.writeFileSync('src/enterprise/workspace/modules/ProfileModule.tsx', code);
console.log("Patched NIP in ProfileModule");
