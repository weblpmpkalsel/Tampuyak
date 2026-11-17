const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldTabs = `    { id: "profile", label: "Profil Pengguna", icon: UserCircle },
    { id: "theme", label: "Tema & Tampilan", icon: Palette },
    { id: "storage", label: "Penyimpanan & Backup", icon: Database },
    { id: "notification", label: "Notifikasi", icon: Bell },
    { id: "about", label: "Tentang Tampuyak", icon: Info },`;

const newTabs = `    { id: "governance", label: "Enterprise Governance", icon: Lock },
    { id: "profile", label: "Profil Pengguna", icon: UserCircle },
    { id: "theme", label: "Tema & Tampilan", icon: Palette },
    { id: "storage", label: "Penyimpanan & Backup", icon: Database },
    { id: "notification", label: "Notifikasi", icon: Bell },
    { id: "about", label: "Tentang Tampuyak", icon: Info },`;

code = code.replace(oldTabs, newTabs);

const GovernanceSettingsTab = `
  const EnterpriseGovernanceTab = () => {
    const { settings, updateMetadata } = useApp();
    const isFrozen = settings.metadata?.versionFreeze;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Enterprise Governance & Release Lock</h2>
          <p className="text-sm text-slate-600 mb-6">Pusat pengaturan stabilitas arsitektur dokumen dan kepatuhan regulasi.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${isFrozen ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}\`}>
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Version Freeze Mode</h3>
              <p className="text-sm text-slate-500">Kunci modifikasi skema, template, dan regulasi. Hanya edit teks dokumen yang diizinkan.</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-sm text-slate-600">
             Mode ini digunakan untuk <strong className="text-slate-800">memastikan stabilitas aplikasi pada level produksi</strong> (Release Candidate 1.0). Ketika aktif, semua pemeriksaan Pre-Print Validation akan diperketat dan draft tidak bisa dicetak.
          </div>

          <div className="flex justify-end">
            <Button
              className={\`font-bold \${isFrozen ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}\`}
              onClick={() => updateMetadata({ versionFreeze: !isFrozen })}
            >
              {isFrozen ? 'Buka Kunci Sistem (Unfreeze)' : 'Kunci Sistem (Freeze)'}
            </Button>
          </div>
        </div>
      </div>
    );
  };
`;

const oldRenderSettingsTab = `  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":`;

const newRenderSettingsTab = `  const renderTabContent = () => {
    switch (activeTab) {
      case "governance":
        return <EnterpriseGovernanceTab />;
      case "profile":`;

if (code.includes('const EnterpriseGovernanceTab') === false) {
  code = code.replace(oldRenderSettingsTab, GovernanceSettingsTab + newRenderSettingsTab);
}

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('Phase 24 governance settings applied');
