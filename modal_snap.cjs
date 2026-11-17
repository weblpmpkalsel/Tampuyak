const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const target1 = `  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<any>(null);`;

const replacement1 = `  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<any>(null);
  const [isSnapshotConfirmOpen, setIsSnapshotConfirmOpen] = useState(false);
  const [pendingSnapshot, setPendingSnapshot] = useState<any>(null);`;

code = code.replace(target1, replacement1);

const target2 = `  const restoreSnapshot = (snap: any) => {
    if(confirm("Apakah Anda yakin ingin memulihkan snapshot ini? Data saat ini akan ditimpa.")) {
       importSettings(snap.data);
       showToast("Sistem dipulihkan dari Snapshot lokal.", "success");
    }
  };`;

const replacement2 = `  const restoreSnapshot = (snap: any) => {
    setPendingSnapshot(snap);
    setIsSnapshotConfirmOpen(true);
  };
  
  const confirmRestoreSnapshot = () => {
    if (pendingSnapshot) {
      importSettings(pendingSnapshot.data);
      showToast("Sistem dipulihkan dari Snapshot lokal.", "success");
    }
    setIsSnapshotConfirmOpen(false);
    setPendingSnapshot(null);
  };`;

code = code.replace(target2, replacement2);

const target3 = `      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">`;

const replacement3 = `      {isSnapshotConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-amber-50/50">
              <div className="flex items-center text-amber-600 mb-4">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold text-slate-800">Pulihkan Snapshot</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin memulihkan sistem ke snapshot versi <strong>{pendingSnapshot?.version}</strong>? Data saat ini akan ditimpa.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsSnapshotConfirmOpen(false)} className="bg-white">Batal</Button>
                <Button onClick={confirmRestoreSnapshot} className="bg-indigo-600 hover:bg-indigo-700">Ya, Pulihkan</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">`;

code = code.replace(target3, replacement3);

fs.writeFileSync('src/Tampuyak.tsx', code);
console.log('done modal snap');
