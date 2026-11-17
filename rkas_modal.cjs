const fs = require('fs');
let code = fs.readFileSync('src/Tampuyak.tsx', 'utf8');

// We need to add state for the Modal in RKASDerivationView
const stateCode = `
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);

  const handleAddFromMaster = (item: any) => {
    if (!selectedProgramId) return;
    setPrograms(programs.map(p => {
      if (p.id === selectedProgramId) {
        return {
          ...p,
          budgetItems: [
            ...p.budgetItems,
            {
              id: Date.now(),
              name: item.activity,
              volume: 1,
              satuan: item.defaultSatuan,
              harga: item.defaultHarga.toString(),
              total: item.defaultHarga,
              sumberDana: "BOS Reguler"
            }
          ]
        };
      }
      return p;
    }));
    setShowMasterModal(false);
  };
`;

code = code.replace(
  '  const hasApprovedRKT = settings?.documents?.some',
  stateCode + '\n  const hasApprovedRKT = settings?.documents?.some'
);

// We need to update "Tambah Komponen" button to use this modal.
// Oh wait, "Tambah Komponen" is general. But we need a button per program or just general?
// Let's add a button in each program row or just update the global one to open modal and ask for which program.
// Better: Add "Tambah Komponen" button at the end of the table for each program.
const perProgramBtn = `
                    <tr>
                      <td colSpan={7} className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedProgramId(program.id); setShowMasterModal(true); }}>
                          <Plus className="w-4 h-4 mr-2" /> Tambah Komponen dari Referensi Master RKAS
                        </Button>
                      </td>
                    </tr>
`;

code = code.replace(
  /                  <\/tbody>\n                <\/table>/g,
  perProgramBtn + '                  </tbody>\n                </table>'
);

// Add the modal JSX at the end of RKASDerivationView
const modalJSX = `
      {showMasterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Pilih Referensi Master RKAS</h3>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">SNP</th>
                    <th className="px-4 py-3">Komponen</th>
                    <th className="px-4 py-3">Kegiatan</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {RKAS_MASTER_DATA.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{item.code}</td>
                      <td className="px-4 py-2">{item.snp}</td>
                      <td className="px-4 py-2">{item.component}</td>
                      <td className="px-4 py-2">{item.activity}</td>
                      <td className="px-4 py-2">
                        <Button size="sm" onClick={() => handleAddFromMaster(item)}>Pilih</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowMasterModal(false)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  /    <\/div>\n  \);\n};\n\n\nconst DokumenPerencanaanView/g,
  modalJSX + '\n    </div>\n  );\n};\n\n\nconst DokumenPerencanaanView'
);


fs.writeFileSync('src/Tampuyak.tsx', code);
console.log("Master RKAS implemented");
