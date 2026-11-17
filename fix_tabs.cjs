const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const oldTabsCode = `  const tabs = [
    { id: "dashboard", label: "Ringkasan", icon: LayoutDashboard },
    { id: "school", label: "Profil Sekolah", icon: Building2 },
    { id: "identitas", label: "Identitas", icon: Target },
    { id: "visualIdentity", label: "Identitas Visual", icon: Palette },
    { id: "karakteristik", label: "Karakteristik", icon: Map },
    { id: "potensi", label: "Potensi", icon: Compass },
    { id: "programUnggulan", label: "Program Unggulan", icon: Star },
    { id: "pejabat", label: "Pejabat Penandatangan", icon: FileSignature },
    { id: "guru", label: "Guru", icon: Users },
    { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase },
    { id: "pesertaDidik", label: "Peserta Didik", icon: Users },
    { id: "rombel", label: "Rombel", icon: Layers },
    { id: "sarpras", label: "Sarpras", icon: Home },
    { id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },
    { id: "import", label: "Pusat Impor Data", icon: Upload },
    { id: "budget", label: "Data Pendukung (BOS)", icon: Wallet },
  ];`;

const newTabsCode = `  const menuGroups = [
    {
      title: "Identitas Sekolah",
      items: [
        { id: "school", label: "Identitas Sekolah", icon: Building2 },
        { id: "visualIdentity", label: "Identitas Visual", icon: Palette },
        { id: "karakteristik", label: "Karakteristik Sekolah", icon: Map },
        { id: "potensi", label: "Potensi Sekolah", icon: Compass },
        { id: "programUnggulan", label: "Program Unggulan", icon: Star },
      ]
    },
    {
      title: "Sumber Daya Sekolah",
      items: [
        { id: "guru", label: "Guru", icon: Users },
        { id: "tendik", label: "Tenaga Kependidikan", icon: Briefcase },
        { id: "pesertaDidik", label: "Peserta Didik", icon: Users },
        { id: "rombel", label: "Rombel", icon: Layers },
        { id: "sarpras", label: "Sarana & Prasarana", icon: Home },
      ]
    },
    {
      title: "Manajemen Sekolah",
      items: [
        { id: "pejabat", label: "Pejabat Penandatangan", icon: FileSignature },
        { id: "academicYear", label: "Tahun Pelajaran", icon: Calendar },
        { id: "import", label: "Pusat Impor Data", icon: Upload },
      ]
    }
  ];`;

code = code.replace(oldTabsCode, newTabsCode);

const oldSidebar = `        <div className="space-y-1">
          {tabs.map((tab) => {
            const hasChecklistItems = CHECKLIST_ITEMS.some(
              (item) => item.section === tab.id,
            );
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 group \${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}\`}
              >
                <tab.icon
                  className={\`w-4 h-4 mr-3 transition-colors \${activeTab === tab.id ? "text-indigo-200" : "text-slate-400 group-hover:text-slate-600"}\`}
                />
                {tab.label}
                {hasChecklistItems && (
                  <div className="ml-auto">
                    <div
                      className={\`w-2.5 h-2.5 rounded-full \${readiness.getSectionColor(tab.id)}\`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>`;

const newSidebar = `        <div className="space-y-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 mt-2">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((tab) => {
                  const hasChecklistItems = CHECKLIST_ITEMS.some(
                    (item) => item.section === tab.id,
                  );
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={\`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 group \${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}\`}
                    >
                      <tab.icon
                        className={\`w-4 h-4 mr-3 transition-colors \${activeTab === tab.id ? "text-indigo-200" : "text-slate-400 group-hover:text-slate-600"}\`}
                      />
                      {tab.label}
                      {hasChecklistItems && (
                        <div className="ml-auto">
                          <div
                            className={\`w-2.5 h-2.5 rounded-full \${readiness.getSectionColor(tab.id)}\`}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>`;

code = code.replace(/<h2 className="text-\[11px\] font-black text-slate-400 uppercase tracking-widest px-4 mb-4 mt-2">[\s\S]*?Kategori[\s\S]*?<\/h2>/, '');
code = code.replace(oldSidebar, newSidebar);

fs.writeFileSync('src/Tampuyak.tsx', code);
