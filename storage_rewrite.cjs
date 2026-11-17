const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const regex = /const StorageTab = \(\) => \{[\s\S]*?(?=\n\nconst AboutTab = \(\) => \{)/;

const newStorageTab = `const StorageTab = () => {
  const { settings, importSettings, resetSettings, updateMetadata, showToast, importModule, createSnapshot } = useApp();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [exportType, setExportType] = useState("Full Backup");
  const [importType, setImportType] = useState("Full Backup");
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastBackup = settings.metadata?.lastBackup;
  const isHealthy = lastBackup ? (Date.now() - lastBackup) < 3 * 24 * 60 * 60 * 1000 : false;

  const handleExport = () => {
    let dataToExport: any = settings;
    let prefix = "tampuyak-data";
    
    if (exportType === "Data Sekolah") {
      dataToExport = { school: settings.school, guru: settings.guru, tendik: settings.tendik, pesertaDidik: settings.pesertaDidik, rombel: settings.rombel, sarpras: settings.sarpras };
      prefix = "tampuyak-datasekolah";
    } else if (exportType === "Rapor") {
      dataToExport = settings.rapor;
      prefix = "tampuyak-rapor";
    } else if (["RKJM", "RKT", "RKAS", "KSP"].includes(exportType)) {
      dataToExport = settings.documents?.find((d: any) => d.type === exportType) || {};
      prefix = \`tampuyak-\${exportType.toLowerCase()}\`;
    }

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const date = new Date();
    const filename = \`\${prefix}-\${date.getFullYear()}\${String(date.getMonth() + 1).padStart(2, "0")}\${String(date.getDate()).padStart(2, "0")}.json\`;
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = filename;
    link.click();
    
    if (exportType === "Full Backup") {
      updateMetadata({ lastBackup: Date.now() });
      showToast("Backup sistem berhasil diunduh.", "success");
    } else {
      showToast(\`Ekspor \${exportType} berhasil.\`, "success");
    }
  };

  const handleImportFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const parsed = JSON.parse(event.target.result);
          // Integrity Check
          if (importType === "Full Backup" && !parsed.metadata) {
            showToast("Data rusak atau bukan format Full Backup yang valid.", "error");
            return;
          }
          if (importType === "Data Sekolah" && !parsed.school) {
            showToast("File tidak berisi Data Sekolah yang valid.", "error");
            return;
          }
          if (["RKJM", "RKT", "RKAS", "KSP"].includes(importType) && parsed.type !== importType) {
            showToast(\`File bukan dokumen \${importType} yang valid.\`, "error");
            return;
          }
          
          setPendingRestoreData(parsed);
          setIsRestoreConfirmOpen(true);
        } catch (err) {
          showToast("File JSON tidak valid atau rusak.", "error");
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmRestore = () => {
    createSnapshot(); // Auto snapshot before restore
    if (importType === "Full Backup") {
      importSettings(pendingRestoreData);
      showToast("Sistem berhasil dipulihkan dari Backup.", "success");
    } else {
      importModule(importType, pendingRestoreData);
      showToast(\`Data \${importType} berhasil diimpor tanpa menghapus data lain.\`, "success");
    }
    setIsRestoreConfirmOpen(false);
    setPendingRestoreData(null);
  };

  const executeReset = () => {
    createSnapshot();
    resetSettings();
    setIsResetOpen(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  const restoreSnapshot = (snap: any) => {
    if(confirm("Apakah Anda yakin ingin memulihkan snapshot ini? Data saat ini akan ditimpa.")) {
       importSettings(snap.data);
       showToast("Sistem dipulihkan dari Snapshot lokal.", "success");
    }
  };

  const exportOptions = ["Full Backup", "Data Sekolah", "Rapor", "RKJM", "RKT", "RKAS", "KSP"];

  return (
    <div className="space-y-6 pb-12">
      {/* Health Check */}
      <div className={\`p-6 rounded-2xl flex items-center justify-between border \${isHealthy ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}\`}>
        <div className="flex items-start">
          <div className={\`p-3 rounded-full mr-4 \${isHealthy ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}\`}>
            {isHealthy ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className={\`text-lg font-bold mb-1 \${isHealthy ? "text-emerald-800" : "text-amber-800"}\`}>
              {isHealthy ? "Penyimpanan Aman" : "Peringatan Keamanan Data"}
            </h3>
            <p className={\`text-sm \${isHealthy ? "text-emerald-600" : "text-amber-600"}\`}>
              Backup Terakhir: {lastBackup ? new Date(lastBackup).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Belum pernah"}
            </p>
            {!isHealthy && <p className="text-xs mt-2 text-amber-700 font-medium">Disarankan untuk segera membuat Backup baru untuk mencegah kehilangan data.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Ekspor Data" description="Unduh data Anda untuk dicadangkan.">
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pilih Modul Ekspor</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
              >
                {exportOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <Button icon={Download} onClick={handleExport} className="w-full bg-indigo-600 hover:bg-indigo-700">
              Ekspor {exportType} (JSON)
            </Button>
          </div>
        </Card>

        <Card title="Impor & Pemulihan" description="Pulihkan data dari file JSON.">
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pilih Target Impor</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                value={importType}
                onChange={(e) => setImportType(e.target.value)}
              >
                {exportOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImportFile}
            />
            <Button
              icon={Upload}
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              Impor {importType} (JSON)
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Riwayat Snapshot Lokal" description="Sistem otomatis membuat snapshot sebelum pemulihan atau reset.">
        <div className="mt-4 space-y-3">
          {(!settings.snapshots || settings.snapshots.length === 0) ? (
            <div className="text-center py-6 text-slate-500 text-sm">Belum ada snapshot.</div>
          ) : (
            settings.snapshots.map((snap: any) => (
              <div key={snap.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <div className="text-sm font-bold text-slate-800">{new Date(snap.timestamp).toLocaleString('id-ID')}</div>
                  <div className="text-xs text-slate-500 mt-1">Versi: {snap.version} • Ukuran: {(snap.size / 1024).toFixed(1)} KB</div>
                </div>
                <Button variant="outline" onClick={() => restoreSnapshot(snap)} className="text-xs px-3 py-1.5 h-auto">Pulihkan</Button>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="p-6 bg-red-50 rounded-2xl flex items-center justify-between border border-red-100">
        <div>
          <h4 className="text-red-700 font-bold mb-1">Zona Berbahaya</h4>
          <p className="text-sm text-red-600">
            Hapus seluruh Master Data & State secara permanen.
          </p>
        </div>
        <Button
          icon={Trash2}
          variant="danger"
          onClick={() => setIsResetOpen(true)}
        >
          Reset Sistem
        </Button>
      </div>

      {isRestoreConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-amber-50/50">
              <div className="flex items-center text-amber-600 mb-4">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold text-slate-800">Konfirmasi Pemulihan</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Anda akan mengimpor data <strong className="text-slate-800">{importType}</strong>. 
                {importType === "Full Backup" ? " Tindakan ini akan menimpa seluruh data sekolah yang ada saat ini." : " Tindakan ini akan menimpa modul yang dipilih tanpa menghapus modul lainnya."}
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center text-sm text-emerald-600 mb-6 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <ShieldCheck className="w-5 h-5 mr-2 flex-shrink-0" />
                Snapshot otomatis akan dibuat sebelum pemulihan, sehingga Anda dapat membatalkan tindakan ini nanti.
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsRestoreConfirmOpen(false)} className="bg-white">Batal</Button>
                <Button onClick={confirmRestore} className="bg-indigo-600 hover:bg-indigo-700">Ya, Pulihkan Data</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-red-50/50">
              <div className="flex items-center text-red-600 mb-4">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold text-slate-800">Hapus Semua Data?</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tindakan ini akan menghapus seluruh profil sekolah, Rapor, RKJM, RKT, RKAS, dan pengaturan aplikasi.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center text-sm text-emerald-600 mb-6 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <ShieldCheck className="w-5 h-5 mr-2 flex-shrink-0" />
                Snapshot otomatis akan dibuat sebelum reset, agar dapat dipulihkan jika Anda berubah pikiran.
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsResetOpen(false)} className="bg-white">Batal</Button>
                <Button variant="danger" onClick={executeReset}>Ya, Hapus Data</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(regex, newStorageTab);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done storage rewrite');
