const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

const approveRKTFunc = `
  const handleApproveRKT = () => {
    setSyncStatus("synced");
    showSuccess("RKT berhasil disetujui dan dikunci.");
    if (settings.documents) {
      let docs = [...settings.documents];
      let rktIdx = docs.findIndex((d: any) => d.id === "rkt");
      if (rktIdx >= 0) docs[rktIdx] = { ...docs[rktIdx], status: "Disetujui" };
      
      let rkasIdx = docs.findIndex((d: any) => d.id === "rkas");
      if (rkasIdx >= 0) docs[rkasIdx] = { ...docs[rkasIdx], status: "Needs Synchronization" };
      
      updateSetting("documents", "", docs);
    }
  };
`;

code = code.replace(
  'const RKTDerivationView = ({ navigateToView }: any) => {',
  'const RKTDerivationView = ({ navigateToView, updateSetting }: any) => {'
);
code = code.replace(
  '  const [syncStatus, setSyncStatus] = useState<',
  approveRKTFunc + '\n  const [syncStatus, setSyncStatus] = useState<'
);

code = code.replace(
  /<Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">\n\s*<CheckCircle2 className="w-4 h-4 mr-2" \/> Kunci & Setujui RKT\n\s*<\/Button>/g,
  '<Button onClick={handleApproveRKT} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">\n          <CheckCircle2 className="w-4 h-4 mr-2" /> Kunci & Setujui RKT\n        </Button>'
);


fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("RKT Approval implemented");
