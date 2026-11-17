const fs = require('fs');
let code = fs.readFileSync('src/enterprise/workspace/modules/AdministrativeMetadataModule.tsx', 'utf8');

const replacement = `      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Tim Penyusun (Drafting Team)</h2>
        </div>
        <div className="space-y-4">
          {(settings?.draftingTeam || []).map((member: any, idx: number) => (
            <div key={idx} className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={member.name || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], name: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Peran (mis: Ketua Tim)"
                value={member.role || ''}
                onChange={(e) => {
                  const n = [...(settings?.draftingTeam || [])];
                  n[idx] = { ...n[idx], role: e.target.value };
                  updateSetting('draftingTeam', '', n);
                }}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              <button
                onClick={() => {
                  const n = [...(settings?.draftingTeam || [])];
                  n.splice(idx, 1);
                  updateSetting('draftingTeam', '', n);
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const n = [...(settings?.draftingTeam || []), { name: '', role: '' }];
              updateSetting('draftingTeam', '', n);
            }}
            className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            + Tambah Anggota Tim
          </button>
        </div>
      </div>
    </div>`;

code = code.replace(/    <\/div>\n\s*$/m, replacement);

fs.writeFileSync('src/enterprise/workspace/modules/AdministrativeMetadataModule.tsx', code);
console.log("Patched Admin Team");
