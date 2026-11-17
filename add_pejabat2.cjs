const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf-8');

const pejabatCode = `  Pejabat: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const updateKadis = (f, v) => updateSetting("kepalaDinas", f, v);
    const updatePrincipal = (f, v) => updateSetting("principal", f, v);
    const updateKomite = (f, v) => updateSetting("komite", f, v);
    const updatePengawas = (f, v) => updateSetting("pengawas", f, v);
    const updateBendahara = (f, v) => updateSetting("bendaharaBOS", f, v);

    return (
      <div className="space-y-6">
        <PageHelp title="Pejabat Penandatangan" description="Kelola data pimpinan dan pejabat untuk penandatanganan dokumen." importance="Digunakan sebagai referensi data di seluruh lembar pengesahan." nextStep="Isi seluruh data pejabat." />
        
        <Card title="Kepala Sekolah" icon={UserCircle} description="Data Kepala Sekolah Definitif / PLT.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Lengkap" value={settings.principal?.name || ""} onChange={(v) => updatePrincipal("name", v)} placeholder="Cth: Budi Santoso, S.Pd., M.Pd." />
            <Input label="NIP" value={settings.principal?.nip || ""} onChange={(v) => updatePrincipal("nip", v)} />
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" value={settings.principal?.status || "Definitif"} onChange={(e) => updatePrincipal("status", e.target.value)}>
                <option value="Definitif">Definitif</option>
                <option value="PLT">PLT</option>
              </select>
            </div>
            <Input label="Pangkat/Golongan" value={settings.principal?.group || ""} onChange={(v) => updatePrincipal("group", v)} placeholder="Cth: Pembina / IV.a" />
            <Input label="Nomor SK" value={settings.principal?.noSk || ""} onChange={(v) => updatePrincipal("noSk", v)} />
            <Input label="Tanggal SK" type="date" value={settings.principal?.tglSk || ""} onChange={(v) => updatePrincipal("tglSk", v)} />
          </div>
        </Card>

        <Card title="Bendahara BOS" icon={Briefcase} description="Data Bendahara Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Lengkap" value={settings.bendaharaBOS?.name || ""} onChange={(v) => updateBendahara("name", v)} />
            <Input label="NIP" value={settings.bendaharaBOS?.nip || ""} onChange={(v) => updateBendahara("nip", v)} />
          </div>
        </Card>

        <Card title="Ketua Komite" icon={Users} description="Data Ketua Komite Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Ketua Komite" value={settings.komite?.name || ""} onChange={(v) => updateKomite("name", v)} />
            <Input label="Nomor Telepon" value={settings.komite?.phone || ""} onChange={(v) => updateKomite("phone", v)} />
          </div>
        </Card>

        <Card title="Pengawas Pembina" icon={UserCheck} description="Data Pengawas Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Pengawas" value={settings.pengawas?.name || ""} onChange={(v) => updatePengawas("name", v)} />
            <Input label="NIP" value={settings.pengawas?.nip || ""} onChange={(v) => updatePengawas("nip", v)} />
          </div>
        </Card>

        <Card title="Kepala Dinas" icon={Building2} description="Data Kepala Dinas Pendidikan terkait.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input label="Nama Kepala Dinas" value={settings.kepalaDinas?.name || ""} onChange={(v) => updateKadis("name", v)} />
            <Input label="NIP" value={settings.kepalaDinas?.nip || ""} onChange={(v) => updateKadis("nip", v)} />
            <Input label="Jabatan" value={settings.kepalaDinas?.jabatan || ""} onChange={(v) => updateKadis("jabatan", v)} placeholder="Cth: Kepala Dinas Pendidikan Kota Banjarmasin" />
          </div>
        </Card>
      </div>
    );
  },`;

code = code.replace('const SettingsTabs = {', 'const SettingsTabs = {\n' + pejabatCode);
fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Pejabat Tab added!');
