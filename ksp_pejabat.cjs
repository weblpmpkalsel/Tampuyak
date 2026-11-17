const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// We need to add SettingsTabs.Pejabat. Where to put it?
// Let's insert it before `SettingsTabs = {` ... wait, `SettingsTabs` is an object.
// Let's replace `const SettingsTabs = {` with `const SettingsTabs = {\n  Pejabat: ({ appCtx }: any) => { ... },`

const pejabatCode = `  Pejabat: ({ appCtx }: any) => {
    const { settings, updateSetting } = appCtx;
    const updateKadis = (f: any, v: any) => updateSetting("kepalaDinas", f, v);
    const updatePrincipal = (f: any, v: any) => updateSetting("principal", f, v);
    const updateKomite = (f: any, v: any) => updateSetting("komite", f, v);
    const updatePengawas = (f: any, v: any) => updateSetting("pengawas", f, v);

    return (
      <div className="space-y-6">
        <Card title="Kepala Sekolah" icon={UserCircle} description="Data Kepala Sekolah Definitif / PLT.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormInput label="Nama Lengkap" value={settings.principal.name} onChange={(v: any) => updatePrincipal("name", v)} placeholder="Cth: Budi Santoso, S.Pd., M.Pd." />
            <FormInput label="NIP" value={settings.principal.nip} onChange={(v: any) => updatePrincipal("nip", v)} />
            <FormSelect label="Status" value={settings.principal.status} onChange={(v: any) => updatePrincipal("status", v)} options={["Definitif", "PLT"]} />
            <FormInput label="Pangkat/Golongan" value={settings.principal.group} onChange={(v: any) => updatePrincipal("group", v)} placeholder="Cth: Pembina / IV.a" />
            <FormInput label="Nomor SK" value={settings.principal.noSk} onChange={(v: any) => updatePrincipal("noSk", v)} />
            <FormInput label="Tanggal SK" type="date" value={settings.principal.tglSk} onChange={(v: any) => updatePrincipal("tglSk", v)} />
          </div>
        </Card>

        <Card title="Ketua Komite" icon={Users} description="Data Ketua Komite Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormInput label="Nama Ketua Komite" value={settings.komite.name} onChange={(v: any) => updateKomite("name", v)} />
            <FormInput label="Nomor Telepon" value={settings.komite.phone} onChange={(v: any) => updateKomite("phone", v)} />
            <FormInput label="Pekerjaan" value={settings.komite.pekerjaan} onChange={(v: any) => updateKomite("pekerjaan", v)} />
            <FormInput label="Alamat" value={settings.komite.address} onChange={(v: any) => updateKomite("address", v)} />
            <FormInput label="Nomor SK" value={settings.komite.noSk} onChange={(v: any) => updateKomite("noSk", v)} />
            <FormInput label="Tanggal Mulai" type="date" value={settings.komite.tglMulai} onChange={(v: any) => updateKomite("tglMulai", v)} />
          </div>
        </Card>

        <Card title="Pengawas Pembina" icon={UserCheck} description="Data Pengawas Sekolah.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormInput label="Nama Pengawas" value={settings.pengawas.name} onChange={(v: any) => updatePengawas("name", v)} />
            <FormInput label="NIP" value={settings.pengawas.nip} onChange={(v: any) => updatePengawas("nip", v)} />
            <FormInput label="Pangkat/Golongan" value={settings.pengawas.pangkat} onChange={(v: any) => updatePengawas("pangkat", v)} />
            <FormInput label="Instansi" value={settings.pengawas.instansi} onChange={(v: any) => updatePengawas("instansi", v)} />
          </div>
        </Card>

        <Card title="Kepala Dinas" icon={Building2} description="Data Kepala Dinas Pendidikan terkait.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormInput label="Nama Kepala Dinas" value={settings.kepalaDinas?.name || ""} onChange={(v: any) => updateKadis("name", v)} />
            <FormInput label="NIP" value={settings.kepalaDinas?.nip || ""} onChange={(v: any) => updateKadis("nip", v)} />
            <FormInput label="Jabatan" value={settings.kepalaDinas?.jabatan || ""} onChange={(v: any) => updateKadis("jabatan", v)} placeholder="Cth: Kepala Dinas Pendidikan Kota Banjarmasin" />
            <FormInput label="Instansi" value={settings.kepalaDinas?.instansi || ""} onChange={(v: any) => updateKadis("instansi", v)} />
            <FormInput label="Nomor SK (Opsional)" value={settings.kepalaDinas?.noSk || ""} onChange={(v: any) => updateKadis("noSk", v)} />
            <FormInput label="Tanggal Mulai (Opsional)" type="date" value={settings.kepalaDinas?.tglMulai || ""} onChange={(v: any) => updateKadis("tglMulai", v)} />
            <FormInput label="Tanggal Berakhir (Opsional)" type="date" value={settings.kepalaDinas?.tglSelesai || ""} onChange={(v: any) => updateKadis("tglSelesai", v)} />
            <FormSelect label="Status Aktif" value={settings.kepalaDinas?.statusAktif === false ? "false" : "true"} onChange={(v: any) => updateKadis("statusAktif", v === "true")} options={[{label: "Aktif", value: "true"}, {label: "Tidak Aktif", value: "false"}]} />
          </div>
        </Card>
      </div>
    );
  },
`;

code = code.replace('const SettingsTabs = {', 'const SettingsTabs = {\n' + pejabatCode);

// Update renderTabContent in DataSekolahView
code = code.replace(
  '      case "principal":',
  '      case "pejabat":\n        return <SettingsTabs.Pejabat appCtx={appCtx} />;\n      case "principal":'
);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Pejabat Tab added!');
